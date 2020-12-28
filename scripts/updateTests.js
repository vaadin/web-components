#!/usr/bin/env node
const replace = require('replace-in-file');

const skipTests = {
  files: 'packages/vaadin-upload/test/adding-files.test.js',
  from: `describe('with add button', () => {`,
  to: `const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  (isFirefox ? describe.skip : describe)('with add button', () => {`
};

replace.sync(skipTests);
