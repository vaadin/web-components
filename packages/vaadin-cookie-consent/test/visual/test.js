gemini.suite('vaadin-cookie-consent', function(rootSuite) {
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
      .before(function(actions, find) {
        actions.waitForElementToShow('.cc-window', 5000);
      }).setCaptureElements('.cc-window')
      .capture('default-banner');
  });

});
