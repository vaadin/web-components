gemini.suite('vaadin-text-field', function(rootSuite) {
  function wait(actions, find) {
    actions.wait(5000);
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

  gemini.suite('default-tests', function(suite) {
    suite
      .setUrl('/default.html')
      .setCaptureElements('#default-tests')
      .capture('default');
  });

  gemini.suite('control-state', function(suite) {
    suite
      .setUrl('/control-state.html')
      .setCaptureElements('#focus-ring')
      .capture('control-state-focused')
      .capture('control-state-focus-ring', function(actions, find) {
        actions.sendKeys(gemini.TAB);
      });
  });

  gemini.suite('styling', function(suite) {
    suite
      .setUrl('styling.html')
      .setCaptureElements('vaadin-text-field')
      .capture('default');
  });

});
