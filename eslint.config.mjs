import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...prettier.rules, // Prettier integration
      'no-console': 0,
      'no-unused-vars': 'error',
      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],
      'semi-style': ['error', 'last'],
      'max-len': [
        'error',
        {
          code: 200,
        },
      ],
      'no-irregular-whitespace': 'error',
      'no-trailing-spaces': 'error',
      'no-multi-spaces': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
];
