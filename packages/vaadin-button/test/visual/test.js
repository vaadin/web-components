gemini.suite('vaadin-button', function(rootSuite) {
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
      .capture('default')
      .capture('focus-tabindex', function(actions) {
        actions.sendKeys(gemini.TAB);
      });
  });

  gemini.suite('styling', function(suite) {
    suite
      .setUrl('styling.html')
      .setCaptureElements('vaadin-button')
      .capture('default');
  });

});
