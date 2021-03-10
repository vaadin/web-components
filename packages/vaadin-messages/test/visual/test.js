function assertView(testView, testFile) {
  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-${testView}`, function () {
      const locator = '#tests[data-ready]';
      return this.browser
        .url(`${testFile}?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-${testView}-ltr`, locator)
        .execute(() => {
          window.document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-${testView}-rtl`, locator);
    });
  });
}

describe('vaadin-message', () => {
  assertView('message', 'default.html');
});

describe('vaadin-message-list', () => {
  assertView('message-list', 'message-list.html');
  assertView('message-list-focus', 'message-list-focus.html');
});

describe('vaadin-message-input', () => {
  assertView('message-input', 'message-input.html');
});
