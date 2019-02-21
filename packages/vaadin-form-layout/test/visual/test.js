gemini.suite('vaadin-form-layout', function(rootSuite) {
  function wait(actions, find) {
    return actions
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
  }

  function goToAboutBlank(actions, find) {
    // Firefox stops responding on socket after a test, workaround:
    return actions.executeJS(function(window) {
      window.location.href = 'about:blank'; // just go away, please!
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

  rootSuite
    .before(wait)
    .after(goToAboutBlank);
  ['lumo', 'material'].forEach(theme => {
    [
      'basic',
      'single-column',
      'responsive-steps',
      'colspan',
      'br',
      'css-properties',
      'styling',
      'vertical-layout'
    ].forEach(testName => {
      gemini.suite(`${testName}-${theme}`, function(suite) {
        suite
          .setUrl(`${testName}.html?theme=${theme}`)
          .setCaptureElements('#capture')
          .capture('default')
          .capture('20em', setBodyWidth('20em'))
          .capture('10em', setBodyWidth('10em'));
      });
    });
  });
});
