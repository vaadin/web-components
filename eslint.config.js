import prettier from 'eslint-config-vaadin/prettier';
import testing from 'eslint-config-vaadin/testing';
import typescript from 'eslint-config-vaadin/typescript';
import esX from 'eslint-plugin-es-x';
import html from 'eslint-plugin-html';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  {
    ignores: [
      'coverage/**/*.js',
      'dist/**/*.js',
      'packages/**/vendor/*.js',
      'packages/**/dist/*.js',
      'packages/**/test/dom/__snapshots__/*.snap.js',
      'packages/**/test/*.generated.test.js',
      'packages/**/theme/**/*.d.ts',
    ],
  },
  ...typescript,
  ...testing,
  ...prettier,
  {
    plugins: {
      'es-x': esX,
      'no-only-tests': noOnlyTests,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },
    rules: {
      '@typescript-eslint/class-literal-property-style': 'off',
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/max-params': ['error', { max: 5 }],
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-only-tests/no-only-tests': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              // Side-effects group
              '^\\u0000',
              // External group
              '^',
              // Vaadin group
              '^@vaadin',
              // Parent group
              '^\\.\\.',
              // Sibling group
              '^\\.',
            ],
          ],
        },
      ],
      'arrow-body-style': 'off',
      'consistent-return': 'off',
      'func-names': 'off',
      'no-await-in-loop': 'off',
      'no-bitwise': 'off',
      'no-multi-assign': 'off',
      'no-param-reassign': 'off',
      'one-var': 'off',
      'prefer-destructuring': 'off',
      'prefer-object-has-own': 'off',
      'prefer-promise-reject-errors': 'off',
      radix: 'off',
    },
  },
  {
    files: ['packages/**/*', 'test/integration/**', 'dev/**/*'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['dev/**/*.html'],
    plugins: { html },
  },
  {
    files: ['packages/**/vaadin-*.js'],
    rules: {
      // Ban ES2020, ES2021 operators in source component files, as they aren't supported by Polymer analyzer
      'es-x/no-optional-chaining': 'error',
      'es-x/no-nullish-coalescing-operators': 'error',
      'es-x/no-logical-assignment-operators': 'error',
      'logical-assignment-operators': 'off',
    },
  },
  {
    files: ['packages/*/src/**/*.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops are slower than Object.{keys,values,entries} and have their caveats.',
        },
        {
          selector: "CallExpression[callee.property.name='validate']",
          message:
            "Don't call validate() directly - it bypasses manual validation mode. Use _requestValidation() instead",
        },
      ],
    },
  },
  {
    files: ['packages/*/src/**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^TItem' }],
    },
  },
  {
    files: ['scripts/**/*.js', '*.config.js', 'wtr-utils.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['packages/**/gulpfile.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['packages/**/test/**', 'test/integration/**'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
    rules: {
      'no-await-in-loop': 'off',
      'max-classes-per-file': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              // Testing tools group
              '^(@web|@vaadin/chai-plugins|@vaadin/test-runner-commands|@vaadin/testing-helpers|sinon)',
              // Side-effects group
              '^\\u0000',
              // External group
              '^',
              // Vaadin group
              '^@vaadin',
              // Parent group
              '^\\.\\.',
              // Sibling group
              '^\\.',
            ],
          ],
        },
      ],
    },
  },
];
