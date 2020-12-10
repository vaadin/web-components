describe('vaadin-list-box', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    ['ltr', 'rtl'].forEach((dir) => {
      it(`${theme}-list-box-${dir}`, function () {
        return this.browser
          .url(`list-box.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 10000)
          .assertView(`${theme}-list-box-${dir}`, locator);
      });
    });
  });
});
