describe('vaadin-date-time-picker', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    ['ltr', 'rtl'].forEach((dir) => {
      it(`${theme}-default-${dir}`, function () {
        return this.browser
          .url(`default.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-default-${dir}`, locator);
      });

      it(`${theme}-alignment-${dir}`, function () {
        return this.browser
          .url(`alignment.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-alignment-${dir}`, locator);
      });
    });

    it(`${theme}-flex-behaviour`, function () {
      return this.browser
        .url(`flex-behaviour.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-flex-normal`, locator)
        .execute(() => {
          const container = window.document.querySelector('#tests');
          container.style.display = 'block';
          container.style.width = '235px';
        })
        .assertView(`${theme}-flex-small`, locator);
    });
  });
});
