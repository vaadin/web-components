gemini.suite('vaadin-button', function(rootSuite) {

  rootSuite.setUrl('/');

  gemini.suite('vaadin-button', function(suite) {
    suite
      .setCaptureElements('#visual-tests')
      .capture('default', {}, function(actions, find) {
        actions.wait(3000); // hack for IE/Edge
      })
      .capture('focus-tabindex', {}, function(actions, find) {
        actions.sendKeys(gemini.TAB);
      });
  });

});
