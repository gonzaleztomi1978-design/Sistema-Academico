import eslint from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  eslint.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
  { files: ['**/*.jsx'], rules: { 'no-unused-vars': 'off' } },
];