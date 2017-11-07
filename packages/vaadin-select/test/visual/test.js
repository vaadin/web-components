gemini.suite('vaadin-dropdown-menu', function(rootSuite) {

  gemini.suite('dropdown-menu', function(suite) {
    suite
      .setUrl('/dropdown-menu.html')
      .setCaptureElements('#dropdown-menu')
      .before(actions => {
        actions
          .waitForJSCondition(function(window) {
            return window.webComponentsAreReady;
          }, 120000);
      })
      .capture('dropdown-menu');
  });

});
