import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

// Configuration plate équivalente à l'ancien .eslintrc.json (ESLint 9 ne lit plus celui-ci par défaut).
const eslintConfig = [
  { linterOptions: { reportUnusedDisableDirectives: 'off' } },
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'coverage/',
      'playwright-report/',
      '.lighthouseci/',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:jsx-a11y/recommended'),
  {
    rules: {
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          labelComponents: ['FormField'],
          controlComponents: [
            'Input',
            'Textarea',
            'Select',
            'Checkbox',
            'ModuleMultiSelect',
            'Controller',
          ],
          assert: 'either',
          depth: 4,
        },
      ],
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];

export default eslintConfig;
