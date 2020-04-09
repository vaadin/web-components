gemini.suite('vaadin-confirm-dialog', function(rootSuite) {
  function wait(actions, find) {
    return actions
      .waitForJSCondition(function(window) {
        return window.webComponentsAreReady;
      }, 80000);
  }

  function goToAboutBlank(actions, find) {
    // Firefox stops responding on socket after a test, workaround:
    return actions.executeJS(function(window) {
      window.location.href = 'about:blank'; // just go away, please!
    });
  }

  rootSuite
    .before(wait)
    .after(goToAboutBlank);

  ['ltr', 'rtl'].forEach(direction => {
    ['lumo', 'material'].forEach(theme => {

      gemini.suite(`default-tests-${theme}-${direction}`, function(suite) {
        suite
          .setUrl(`default.html?theme=${theme}&dir=${direction}`)
          .setCaptureElements('body')
          .capture('confirm-dialog');
      });

      gemini.suite(`three-actions-tests-${theme}-${direction}`, function(suite) {
        suite
          .setUrl(`three-actions.html?theme=${theme}&dir=${direction}`)
          .setCaptureElements('body')
          .capture('confirm-dialog');
      });

      gemini.suite(`custom-buttons-tests-${theme}-${direction}`, function(suite) {
        suite
          .setUrl(`custom-buttons.html?theme=${theme}&dir=${direction}`)
          .setCaptureElements('body')
          .capture('confirm-dialog');
      });
    });
  });

});
