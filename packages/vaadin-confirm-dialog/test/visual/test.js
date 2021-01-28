describe('vaadin-confirm-dialog', () => {
  const locator = 'body[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    ['ltr', 'rtl'].forEach((dir) => {
      it(`${theme}-default-${dir}`, function () {
        return this.browser
          .url(`default.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-default-${dir}`, locator);
      });

      it(`${theme}-cancel-reject-${dir}`, function () {
        return this.browser
          .url(`cancel-reject.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-cancel-reject-${dir}`, locator);
      });

      it(`${theme}-custom-buttons-${dir}`, function () {
        return this.browser
          .url(`custom-buttons.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-custom-buttons-${dir}`, locator);
      });
    });
  });
});
