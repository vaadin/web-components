describe('vaadin-context-menu', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    ['rtl', 'ltr'].forEach((dir) => {
      it(`${theme}-context-menu-${dir}`, function () {
        return this.browser
          .url(`default.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 10000)
          .execute(() => {
            window.contextmenu(window.document.querySelector('#plain'));
          })
          .assertView(`${theme}-default-${dir}`, locator)
          .execute(() => {
            window.contextmenu(window.document.querySelector('#long'));
          })
          .assertView(`${theme}-long-${dir}`, locator)
          .execute(() => {
            window.contextmenu(window.document.querySelector('#bottom'));
          })
          .assertView(`${theme}-bottom-${dir}`, locator)
          .execute(() => {
            window.contextmenu(window.document.querySelector('#items'));
          })
          .assertView(`${theme}-items-${dir}`, locator);
      });
    });
  });
});
