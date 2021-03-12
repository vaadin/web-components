#!/usr/bin/env node
const replace = require('replace-in-file');

const chrome = 'window.chrome || /HeadlessChrome/.test(navigator.userAgent)';
const firefox = `navigator.userAgent.toLowerCase().indexOf('firefox') > -1`;
const safari = '/^((?!chrome|android).)*safari/i.test(navigator.userAgent)';

const skipTests = {
  files: [
    'packages/vaadin-upload/test/adding-files.test.js',
    'packages/vaadin-combo-box/test/combo-box-light.test.js',
    'packages/vaadin-combo-box/test/keyboard.test.js',
    'packages/vaadin-context-menu/test/device-detector.test.js',
    'packages/vaadin-context-menu/test/integration.test.js',
    'packages/vaadin-context-menu/test/items.test.js',
    'packages/vaadin-menu-bar/test/sub-menu.test.js',
    'packages/vaadin-rich-text-editor/test/basic.test.js',
    'packages/vaadin-split-layout/test/split-layout.test.js',
    'packages/vaadin-radio-button/test/radio-button.test.js',
    'packages/vaadin-messages/test/message.test.js',
    'packages/vaadin-messages/test/message-list.test.js',
    'packages/vaadin-form-layout/test/form-item.test.js'
  ],
  from: [
    `describe('with add button'`,
    `it('should toggle on input click on touch devices'`,
    `it('should not clear on input click on touch devices'`,
    `it('should select the input field text when navigating down'`,
    `it('should select the input field text when navigating up'`,
    `it('should detect touch support'`,
    '<button on-click="_showMenu" id="button">Show context menu</button>',
    `(isIOS ? describe.skip : describe)('scrolling'`,
    `it('should close submenu on mobile when selecting an item in the nested one'`,
    '(isFirefox ? it.skip : it)(`should apply ${fmt} formatting to the selected text on click`',
    `describe('image'`,
    `document.createEvent('TouchEvent');`,
    `it('should set checked on touchend'`,
    `it('should not set checked on touchend when disabled'`,
    `it('should fire on touchend'`,
    /\/test\/visual\/avatars\/avatar\.jpg/g,
    `import '../vaadin-form-item.js';`
  ],
  to: [
    `const isFirefox = ${firefox};
  (isFirefox ? describe.skip : describe)('with add button'`,
    `const isSafari = ${safari};
    (isSafari ? it.skip : it)('should toggle on input click on touch devices'`,
    `(isSafari ? it.skip : it)('should not clear on input click on touch devices'`,
    `const isSafari = ${safari};
    (isSafari ? it.skip : it)('should select the input field text when navigating down'`,
    `(isSafari ? it.skip : it)('should select the input field text when navigating up'`,
    `const isSafari = ${safari};
  (isSafari ? it.skip : it)('should detect touch support'`,
    '<button on-click="_showMenu" id="button" style="margin: 20px">Show context menu</button>',
    `const isChrome = ${chrome};
    (isChrome ? describe : describe.skip)('scrolling'`,
    `const isSafari = ${safari};
  (isSafari ? it.skip : it)('should close submenu on mobile when selecting an item in the nested one'`,
    `const isSafari = ${safari};
        (isFirefox || isSafari ? it.skip : it)(\`should apply \${fmt} formatting to the selected text on click\``,
    `(isFirefox ? describe.skip : describe)('image'`,
    `new Touch({ identifier: 1, target: window });`,
    `const isSafari = ${safari};
    (isSafari ? it.skip : it)('should set checked on touchend'`,
    `const isSafari = ${safari};
    (isSafari ? it.skip : it)('should not set checked on touchend when disabled'`,
    `const isSafari = ${safari};
    (isSafari ? it.skip : it)('should fire on touchend'`,
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
    `import '@polymer/polymer/lib/elements/custom-style.js';
import '../vaadin-form-item.js';`
  ]
};

replace.sync(skipTests);
