gemini.suite('vaadin-form-layout', (rootSuite) => {
  function waitAndBlurAll(actions, find) {
    return actions
      .waitForJSCondition(function(window) {
        return window.webComponentsAreReady;
      }, 60000)
      .executeJS(function(window) {
        // Ensure nothing is focused to prevent blinking cursor
        var input = window.document.createElement('input');
        window.document.body.appendChild(input);
        input.focus();
        window.document.body.removeChild(input);
      });
  }

  function setBodyWidth(bodyWidth) {
    // Can’t use context references in page JS callbacks. Have to use string
    // substitution for the provided bodyWidth.
    const resizeBodyFn = new Function('window', `
      window.document.body.style.width = '${bodyWidth}';
      window.dispatchEvent(new window.CustomEvent('resize'));
    `);
    return function(actions, find) {
      return actions.executeJS(resizeBodyFn);
    };
  }

  gemini.suite('form-layout', suite => {
    suite
      .setUrl(`/form-layout.html`)
      .before(waitAndBlurAll);

    [
      'basic',
      'singleColumn',
      'columns',
      'colspan',
      'br',
      'cssProperties'
    ].forEach(elementId => {
      gemini.suite(elementId, suite => {
        suite.setCaptureElements('#' + elementId)
          .capture('default')
          .capture('20em', setBodyWidth('20em'))
          .capture('10em', setBodyWidth('10em'));
      });
    });
  });
});
