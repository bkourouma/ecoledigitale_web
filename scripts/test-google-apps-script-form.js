const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const DEFAULT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxlJZihDbFs_L9STkat_UzlUxeMc4hsxmn6FCyefG3MqC1e-1_Q344boLCTcl7pTlXE/exec';

loadEnvLocal();

const endpoint =
  process.argv[2] ||
  process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ||
  DEFAULT_ENDPOINT;

const lead = {
  fullName: 'Test EcoleDigitale',
  email: 'test@example.com',
  phone: '+33 1 23 45 67 89',
  institutionName: 'Institut Test',
  role: 'Responsable pedagogique',
  location: 'Paris, France',
  modulesOfInterest: ['parcours-bts', 'campus-live'],
  consent: true,
  studentCount: 120,
  institutionType: 'Institut prive post-bac',
  preferredChannel: 'email',
  message:
    'Ceci est un test automatique du formulaire de demande de demonstration EcoleDigitale.',
  website: '',
  sourcePage: '/demander-demo',
};

async function main() {
  console.log(`POST ${endpoint}`);
  console.log(`Lead de test: ${lead.fullName} <${lead.email}>`);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
      Accept: 'application/json',
    },
    body: JSON.stringify(lead),
  });

  const text = await response.text();
  const data = parseJson(text);

  console.log(`HTTP ${response.status} ${response.statusText}`);
  console.log(data ? JSON.stringify(data, null, 2) : text);

  if (!response.ok || !data?.ok) {
    process.exitCode = 1;
  }
}

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = stripQuotes(value);
    }
  }
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
