import prettier from 'eslint-config-vaadin/prettier';
import react from 'eslint-config-vaadin/react';
import testing from 'eslint-config-vaadin/testing';
import typescript from 'eslint-config-vaadin/typescript';
import html from 'eslint-plugin-html';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import licenseHeader from './custom-rules/eslint/license-header.js';

const LICENSE_HEADER = `
/**
 * @license
 * Copyright (c) 2000 - ${new Date().getFullYear()} Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
`;

const PRO_LICENSE_HEADER = `
/**
 * @license
 * Copyright (c) 2000 - ${new Date().getFullYear()} Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
`;

// The React wrappers were started in 2022 in the vaadin/react-components repo.
const REACT_LICENSE_HEADER = LICENSE_HEADER.replace('2000 - ', '2022 - ');
const REACT_PRO_LICENSE_HEADER = PRO_LICENSE_HEADER.replace('2000 - ', '2022 - ');

const PRO_COMPONENTS = [
  'charts',
  'board',
  'crud',
  'dashboard',
  'grid-pro',
  'rich-text-editor',
  'map',
  'react-components-pro',
];

const REACT_FILES = ['packages/react-components*/**/*.{ts,tsx}', 'react/test/**/*.ts', 'react/dev/**/*.tsx'];

/** Turns off every rule of the React preset whose name starts with the given plugin prefix. */
const reactRulesOff = (prefix) =>
  Object.fromEntries(
    react
      .flatMap((config) => Object.keys(config.rules ?? {}))
      .filter((rule) => rule.startsWith(prefix))
      .map((rule) => [rule, 'off']),
  );

export default [
  {
    ignores: [
      'coverage/**/*.js',
      'dist/**/*.js',
      '**/dist/**/*',
      'packages/**/vendor/*.js',
      'packages/**/dist/*.js',
      'packages/**/test/dom/__snapshots__/*.snap.js',
      'packages/**/test/*.generated.test.js',
      'packages/react-components*/*.{js,d.ts,map}',
      'packages/react-components*/{generated,renderers,utils,css}/**',
      'packages/react-components*/src/generated/**',
    ],
  },
  ...typescript,
  ...testing,
  ...react.map((config) => ({ ...config, files: REACT_FILES })),
  {
    files: REACT_FILES,
    settings: {
      react: { version: '19' },
    },
    rules: {
      'react/jsx-no-literals': 'off', // Wrappers and tests render plain text
      'react/destructuring-assignment': 'off', // Wrappers forward props objects as is
      'react/jsx-pascal-case': 'off', // Generated components use web component class names
      'react/function-component-definition': 'off', // Wrappers use forwardRef with arrow functions
      'react/display-name': 'off', // Wrappers set no display name
      'react/no-this-in-sfc': 'off', // False positives in renderer callbacks
      '@typescript-eslint/no-empty-object-type': 'off', // Props types extend web component types
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Return types are inferred from createComponent
      '@typescript-eslint/no-unsafe-function-type': 'off', // Event handler maps use Function
      '@typescript-eslint/consistent-type-assertions': 'off', // Ref and element casts are needed
      ...reactRulesOff('react-perf/'), // Renderer props take inline JSX, functions, arrays and objects
    },
  },
  ...prettier,
  {
    plugins: {
      'no-only-tests': noOnlyTests,
      'simple-import-sort': simpleImportSort,
      'custom-rules': {
        rules: {
          'license-header': licenseHeader,
        },
      },
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
      'preserve-caught-error': 'off',
      radix: 'off',
    },
  },
  {
    files: ['packages/**/*', 'test/integration/**', 'dev/**/*', 'api-docs/js/**'],
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
    files: ['packages/*/src/**/*.{ts,tsx,js}'],
    rules: {
      'custom-rules/license-header': ['error', { licenseHeader: LICENSE_HEADER }],
    },
  },
  {
    files: [`packages/@(${PRO_COMPONENTS.join('|')})/src/**/*.{ts,tsx,js}`],
    rules: {
      'custom-rules/license-header': ['error', { licenseHeader: PRO_LICENSE_HEADER }],
    },
  },
  {
    files: ['packages/react-components/src/**/*.{ts,tsx}'],
    rules: {
      'custom-rules/license-header': ['error', { licenseHeader: REACT_LICENSE_HEADER }],
    },
  },
  {
    files: ['packages/react-components-pro/src/**/*.{ts,tsx}'],
    rules: {
      'custom-rules/license-header': ['error', { licenseHeader: REACT_PRO_LICENSE_HEADER }],
    },
  },
  {
    files: [
      'scripts/**/*.js',
      '.github/claude/**/*.js',
      '*.config.js',
      'wtr-utils.js',
      'custom-rules/**/*.js',
      'api-docs/.eleventy.js',
      'react/scripts/**/*.{js,ts}',
      'react/*.ts',
      'react/dev/*.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'preserve-caught-error': 'off',
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
  {
    files: ['packages/react-components*/test/**', 'react/dev/**'],
    rules: {
      ...reactRulesOff('jsx-a11y/'), // Test fixtures and dev pages are not real UI
      'react/button-has-type': 'off',
      'react/no-array-index-key': 'off', // Static demo lists
      'react/jsx-no-useless-fragment': 'off', // Renderers in tests return text-only fragments
      '@typescript-eslint/no-unused-vars': 'off', // Typings tests declare unused values, specs destructure partially
      '@typescript-eslint/no-namespace': 'off', // JSX.IntrinsicElements augmentation needs a nested namespace
    },
  },
];
