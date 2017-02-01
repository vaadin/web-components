gemini.suite('vaadin-split-layout', function(rootSuite) {

  rootSuite.setUrl('/');

  gemini.suite('default', function(suite) {
    suite
      .setCaptureElements('#default')
      .capture('default', {}, function(actions, find) {
        actions.wait(3000); // hack for IE/Edge
      });
  });

  gemini.suite('customized', function(suite) {
    suite
      .setCaptureElements('#customized')
      .capture('customized', {}, function(actions, find) {
        actions.wait(3000); // hack for IE/Edge
      });
  });

});
