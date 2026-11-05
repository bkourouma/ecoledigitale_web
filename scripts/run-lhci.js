/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('node:child_process');
const { existsSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');

const repoRoot = process.cwd();
const debugPort = process.env.LHCI_CHROME_PORT || '9222';
const userDataDir = join(repoRoot, '.lighthouseci', `chrome-profile-${Date.now()}`);

function findChrome() {
  const candidates =
    process.platform === 'win32'
      ? [
          join(process.env.PROGRAMFILES || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
          join(
            process.env['PROGRAMFILES(X86)'] || '',
            'Google',
            'Chrome',
            'Application',
            'chrome.exe',
          ),
        ]
      : process.platform === 'darwin'
        ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
        : ['google-chrome', 'chromium-browser', 'chromium'];

  return candidates.find(
    (candidate) => candidate && (process.platform !== 'win32' || existsSync(candidate)),
  );
}

async function waitForChrome() {
  const endpoint = `http://127.0.0.1:${debugPort}/json/version`;
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) return;
    } catch {
      // Chrome is still starting.
    }
    await delay(250);
  }
  throw new Error(`Chrome remote debugging did not start on port ${debugPort}.`);
}

function run(command, args, opts = {}) {
  return new Promise((resolve) => {
    const child =
      process.platform === 'win32'
        ? spawn('cmd.exe', ['/d', '/s', '/c', [command, ...args].join(' ')], {
            cwd: repoRoot,
            env: process.env,
            stdio: 'inherit',
            shell: false,
            ...opts,
          })
        : spawn(command, args, {
            cwd: repoRoot,
            env: process.env,
            stdio: 'inherit',
            shell: false,
            ...opts,
          });
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

async function main() {
  const chromePath = findChrome();
  if (!chromePath) {
    console.error('Chrome executable not found for Lighthouse.');
    process.exit(1);
  }

  const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const buildCode = await run(pnpm, ['build'], {
    env: { ...process.env, VERCEL_ENV: 'production' },
  });
  if (buildCode !== 0) {
    process.exit(buildCode);
  }

  const chrome = spawn(
    chromePath,
    [
      '--headless=new',
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${userDataDir}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      ...(process.platform === 'linux'
        ? ['--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox']
        : []),
    ],
    { stdio: 'ignore' },
  );

  try {
    await waitForChrome();
    const collectCode = await run(pnpm, [
      'exec',
      'lhci',
      'collect',
      '--config=tests/lighthouse/lighthouserc.json',
      `--settings.port=${debugPort}`,
    ]);
    if (collectCode !== 0) {
      process.exitCode = collectCode;
      return;
    }

    const assertCode = await run(pnpm, [
      'exec',
      'lhci',
      'assert',
      '--config=tests/lighthouse/lighthouserc.json',
    ]);
    if (assertCode !== 0) {
      process.exitCode = assertCode;
      return;
    }

    process.exitCode = await run(pnpm, [
      'exec',
      'lhci',
      'upload',
      '--config=tests/lighthouse/lighthouserc.json',
    ]);
  } finally {
    chrome.kill();
    try {
      rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      // Chrome can hold profile files briefly on Windows; .lighthouseci is ignored.
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
