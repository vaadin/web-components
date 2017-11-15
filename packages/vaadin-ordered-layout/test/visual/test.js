gemini.suite('vaadin-ordered-layout', function(rootSuite) {
  rootSuite
    .before(function(actions, find) {
      return actions.waitForJSCondition(function(window) {
        return window.webComponentsAreReady;
      }, 60000);
    })
    .after(function(actions, find) {
      // Firefox stops responding on socket after a test, workaround:
      return actions.executeJS(function(window) {
        window.location.href = 'about:blank'; // just go away, please!
      });
    });

  gemini.suite('horizontal-layout', function(suite) {
    suite
      .setUrl('/default.html')
      .setCaptureElements('#horizontal-layout')
      .capture('horizontal-layout');
  });

  gemini.suite('vertical-layout', function(suite) {
    suite
      .setUrl('/default.html')
      .setCaptureElements('#vertical-layout')
      .capture('vertical-layout');
  });
});
