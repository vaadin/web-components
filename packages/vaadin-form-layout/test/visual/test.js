gemini.suite('vaadin-form-layout', (suite) => {
  suite
    .setCaptureElements('[capture]')
    .before(function(actions, find) {
      return actions
        // Wait until the page sets webComponentsAreReady flag
        .waitForJSCondition(function(window) {
          return window.webComponentsAreReady;
        }, 60000)
        // Ensure nothing is focused to prevent blinking cursor
        .executeJS(function(window) {
          var input = window.document.createElement('input');
          window.document.body.appendChild(input);
          input.focus();
          window.document.body.removeChild(input);
        });
    })
    .after(function(actions, find) {
      // Firefox stops responding on socket after a test, workaround:
      return actions.executeJS(function(window) {
        window.location.href = 'about:blank'; // just go away, please!
      });
    });

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

  [
    'basic',
    'single-column',
    'responsive-steps',
    'colspan',
    'br',
    'css-properties',
    'styling'
  ].forEach(testName => {
    gemini.suite(testName, suite => {
      suite.setUrl(`/${testName}.html`)
        .capture('default')
        .capture('20em', setBodyWidth('20em'))
        .capture('10em', setBodyWidth('10em'));
    });
  });
});
