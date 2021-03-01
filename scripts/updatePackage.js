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

const IGNORED = [
  '@vaadin/vaadin-lumo-styles',
  '@vaadin/vaadin-material-styles',
  '@vaadin/vaadin-icons',
  '@vaadin/vaadin-development-mode-detector',
  '@vaadin/vaadin-license-checker',
  '@vaadin/vaadin-usage-statistics',
  '@vaadin/router'
];

packageJson.version = '20.0.0-alpha1';

Object.keys(packageJson.dependencies).forEach((dep) => {
  if (dep.startsWith('@vaadin') && !IGNORED.includes(dep)) {
    packageJson.dependencies[dep] = '^20.0.0-alpha1';
  }
});

if (packageJson.devDependencies) {
  Object.keys(packageJson.devDependencies).forEach((dep) => {
    if (dep.startsWith('@vaadin') && !IGNORED.includes(dep)) {
      packageJson.devDependencies[dep] = '20.0.0-alpha1';
    }
  });
}

// Format and write changes to package.json
jsonfile.writeFileSync(`packages/${repo}/package.json`, packageJson, { spaces: 2 });
