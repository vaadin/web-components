#!/usr/bin/env node
const path = require('path');
const jsonfile = require('jsonfile');

const repo = process.argv[2] || process.exit(1);

const dir = path.join(process.cwd(), 'packages', repo);
const packageJson = require(path.resolve(dir, 'package.json'));

// Cleanup package.json
delete packageJson.scripts;
delete packageJson.husky;
delete packageJson['lint-staged'];

[
  '@open-wc/rollup-plugin-html',
  '@polymer/iron-component-page',
  '@rollup/plugin-node-resolve',
  '@web/dev-server',
  '@web/test-runner',
  '@web/test-runner-saucelabs',
  'eslint',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
  'hermione',
  'hermione-esm',
  'hermione-sauce',
  'husky',
  'lint-staged',
  'magi-cli',
  'prettier',
  'rimraf',
  'rollup',
  'rollup-plugin-terser',
  'stylelint',
  'stylelint-config-prettier',
  'stylelint-config-vaadin',
  'typescript'
].forEach((dep) => {
  if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    delete packageJson.devDependencies[dep];
  }
});

// TODO: remove after versions are unified.

const fixDepsRanges = (deps, range) => {
  deps.forEach((dep) => {
    if (packageJson.dependencies[dep]) {
      packageJson.dependencies[dep] = range;
    }
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      packageJson.devDependencies[dep] = range;
    }
  });
};

fixDepsRanges(
  [
    '@vaadin/vaadin-button',
    '@vaadin/vaadin-confirm-dialog',
    '@vaadin/vaadin-cookie-consent',
    '@vaadin/vaadin-dialog',
    '@vaadin/vaadin-form-layout'
  ],
  '^3.0.0-alpha1'
);

fixDepsRanges(
  ['@vaadin/vaadin-notification', '@vaadin/vaadin-ordered-layout', '@vaadin/vaadin-radio-button'],
  '^2.0.0-alpha1'
);

fixDepsRanges(['@vaadin/vaadin-accordion'], '^2.0.0-alpha5');
fixDepsRanges(['@vaadin/vaadin-app-layout'], '^3.0.0-alpha3');
fixDepsRanges(['@vaadin/vaadin-details'], '^2.0.0-alpha6');
fixDepsRanges(['@vaadin/vaadin-radio-button', '@vaadin/vaadin-progress-bar'], '^2.0.0-alpha2');

fixDepsRanges(['@vaadin/vaadin-board'], '^4.0.0-alpha1');
fixDepsRanges(['@vaadin/vaadin-charts'], '^9.0.0-alpha1');
fixDepsRanges(['@vaadin/vaadin-split-layout'], '^5.0.0-alpha1');

// Format and write changes to package.json
jsonfile.writeFileSync(`packages/${repo}/package.json`, packageJson, { spaces: 2 });
