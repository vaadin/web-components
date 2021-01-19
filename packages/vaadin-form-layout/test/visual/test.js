describe('vaadin-form-layout', () => {
  const locator = '#tests[data-ready]';

  const setBodyWidth = (bodyWidth) => {
    window.document.body.style.width = bodyWidth;
    window.dispatchEvent(new window.CustomEvent('resize'));
  };

  ['lumo', 'material'].forEach((theme) => {
    ['basic', 'styling', 'vertical-layout'].forEach((testName) => {
      it(`${theme}-${testName}`, function () {
        return this.browser
          .url(`${testName}.html?theme=${theme}`)
          .waitForVisible(locator, 30000)
          .assertView(`${theme}-${testName}-default`, locator)
          .execute(setBodyWidth, '10em')
          .assertView(`${theme}-${testName}-10em`, locator)
          .execute(setBodyWidth, '20em')
          .assertView(`${theme}-${testName}-20em`, locator);
      });
    });

    ['br', 'colspan', 'css-properties', 'responsive-steps', 'single-column'].forEach((testName) => {
      it(`${theme}-${testName}`, function () {
        return this.browser
          .url(`${testName}.html?theme=${theme}`)
          .waitForVisible(locator, 30000)
          .assertView(`${theme}-${testName}-default`, locator)
          .execute(setBodyWidth, '20em')
          .assertView(`${theme}-${testName}-20em`, locator);
      });
    });
  });
});
