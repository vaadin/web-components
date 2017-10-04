gemini.suite('vaadin-nav', function(rootSuite) {

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

  gemini.suite('horizontal-nav', (suite) => {
    suite
      .setUrl('horizontal-nav.html')
      .setCaptureElements('#horizontal-nav')
      .capture('horizontal-nav', {}, (actions, find) => {
        actions.wait(6000);
      });
  });

  gemini.suite('vertical-nav', (suite) => {
    suite
      .setUrl('vertical-nav.html')
      .setCaptureElements('#vertical-nav')
      .capture('vertical-nav', {}, (actions, find) => {
        actions.wait(6000);
      });
  });

  gemini.suite('scrollable-nav', (suite) => {
    suite
      .setUrl('scrollable-nav.html')
      .setCaptureElements('#scrollable-nav')
      .capture('scrollable-nav', {}, (actions, find) => {
        actions.wait(6000);
      });
  });

});
