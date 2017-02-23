gemini.suite('vaadin-split-layout', function(rootSuite) {

  gemini.suite('default', function(suite) {
    suite
      .setUrl('/default.html')
      .setCaptureElements('#default')
      .capture('default', {}, function(actions, find) {
        actions.wait(3000);
      });
  });

  gemini.suite('customized', function(suite) {
    suite
      .setUrl('/customized.html')
      .setCaptureElements('#customized')
      .capture('customized', {}, function(actions, find) {
        actions.wait(3000);
      });
  });

});
