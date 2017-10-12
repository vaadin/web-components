gemini.suite('vaadin-icons', function(rootSuite) {

  gemini.suite('default', function(suite) {
    suite
      .setUrl('icons.html')
      .before(function(actions) {
        actions.waitForJSCondition(function(window) {
          return window.webComponentsAreReady;
        }, 120000).wait(10000);
      })
      .setCaptureElements('.iconset-container')
      .capture('default');
  });

});
