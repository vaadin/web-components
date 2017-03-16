gemini.suite('vaadin-icons', function(rootSuite) {

  gemini.suite('default', function(suite) {
    suite
      .setUrl('../../demo/index.html')
      .setCaptureElements('body')
      .capture('default', {}, function(actions, find) {
        actions.wait(5000);
      });
  });

});
