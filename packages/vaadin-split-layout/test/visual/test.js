gemini.suite('vaadin-split-layout', function(rootSuite) {
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

  gemini.suite('default', function(suite) {
    suite
      .setUrl('default.html')
      .setCaptureElements('#default')
      .capture('default');
  });

  gemini.suite('customized', function(suite) {
    suite
      .setUrl('customized.html')
      .setCaptureElements('#customized')
      .capture('customized');
  });

});
