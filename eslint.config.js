import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

/**
 * Objetivo: lint mínimo do template (JS/Node) sem dependências extras.
 * Descrição: smoke da aula 2 — `npm run lint` precisa passar no CI sem @eslint/json etc.
 */
export default [
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'dist/**',
      'package-lock.json',
      '**/generated/**',
    ],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
