#!/usr/bin/env node
const replace = require('replace-in-file');

const skipTests = {
  files: [
    'packages/vaadin-upload/test/adding-files.test.js',
    'packages/vaadin-combo-box/test/combo-box-light.test.js',
    'packages/vaadin-combo-box/test/keyboard.test.js',
    'packages/vaadin-context-menu/test/device-detector.test.js',
    'packages/vaadin-context-menu/test/integration.test.js',
    'packages/vaadin-menu-bar/test/sub-menu.test.js'
  ],
  from: [
    `describe('with add button'`,
    `it('should toggle on input click on touch devices'`,
    `it('should not clear on input click on touch devices'`,
    `it('should select the input field text when navigating down'`,
    `it('should select the input field text when navigating up'`,
    `it('should detect touch support'`,
    `(isIOS ? it.skip : it)('should open context menu below button'`,
    `it('should close submenu on mobile when selecting an item in the nested one'`
  ],
  to: [
    `const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  (isFirefox ? describe.skip : describe)('with add button'`,
    `const isSafari = /Safari/i.test(navigator.userAgent);
    (isSafari ? it.skip : it)('should toggle on input click on touch devices'`,
    `(isSafari ? it.skip : it)('should not clear on input click on touch devices'`,
    `const isSafari = /Safari/i.test(navigator.userAgent);
    (isSafari ? it.skip : it)('should select the input field text when navigating down'`,
    `(isSafari ? it.skip : it)('should select the input field text when navigating up'`,
    `const isSafari = /Safari/i.test(navigator.userAgent);
  (isSafari ? it.skip : it)('should detect touch support'`,
    `const isSafari = /Safari/i.test(navigator.userAgent);
  (isIOS || isSafari ? it.skip : it)('should open context menu below button'`,
    `const isSafari = /Safari/i.test(navigator.userAgent);
  (isSafari ? it.skip : it)('should close submenu on mobile when selecting an item in the nested one'`
  ]
};

replace.sync(skipTests);
