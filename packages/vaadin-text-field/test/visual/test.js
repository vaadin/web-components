gemini.suite('vaadin-input', function(rootSuite) {

  rootSuite.setUrl('/');

  gemini.suite('visual-tests', function(suite) {
    suite
      .setCaptureElements('#visual-tests')
      .capture('visual-tests', {}, function(actions, find) {
        actions.wait(3000); // hack for Microsoft Edge (https://github.com/vaadin/vaadin-input/issues/10)
      });
  });

});
