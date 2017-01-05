gemini.suite('vaadin-split-layout', function(rootSuite) {

  rootSuite.setUrl('/');

  gemini.suite('default', function(suite) {
    suite
      .setCaptureElements('#default')
      .capture('default');
  });

  gemini.suite('customized', function(suite) {
    suite
      .setCaptureElements('#customized')
      .capture('customized');
  });

});
