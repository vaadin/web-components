gemini.suite('vaadin-text-field', function(rootSuite) {
  function wait(actions, find) {
    actions.wait(5000);
  }

  gemini.suite('default-tests', function(suite) {
    suite
      .setUrl('/default.html')
      .setCaptureElements('#default-tests')
      .capture('default', {}, wait);
  });

  gemini.suite('control-state', function(suite) {
    suite
      .setUrl('/control-state.html')
      .setCaptureElements('#focus-ring')
      .capture('control-state-focused', {}, wait)
      .capture('control-state-focus-ring', function(actions, find) {
        actions.sendKeys(gemini.TAB);
      });
  });

  gemini.suite('styling', function(suite) {
    suite
      .setUrl('styling.html')
      .setCaptureElements('vaadin-text-field')
      .capture('default', {}, wait);
  });

});
