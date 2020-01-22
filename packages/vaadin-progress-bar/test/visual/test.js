gemini.suite('vaadin-progress-bar', function(rootSuite) {
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

  ['lumo', 'material'].forEach(theme => {
    gemini.suite(`default-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#default-tests')
        .capture('vaadin-progress-bar');
    });

    gemini.suite(`default-rtl-${theme}`, function(suite) {
      suite
        .setUrl(`rtl.html?theme=${theme}`)
        .setCaptureElements('#rtl-tests')
        .capture('vaadin-progress-bar');
    });
  });

});
