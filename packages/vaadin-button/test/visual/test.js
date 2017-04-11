gemini.suite('vaadin-button', function(rootSuite) {
  // Hack needed for
  // - Edge (https://github.com/vaadin/vaadin-text-field/issues/10)
  // - Making sure that animations have finished
  // - FF has async focused the input.
  function wait(actions, find) {
    actions.wait(5000);
  }

  gemini.suite('default-tests', function(suite) {
    suite
      .setUrl('/default.html')
      .setCaptureElements('#default-tests')
      .capture('default', {}, wait)
      .capture('focus-tabindex', function(actions) {
        actions.sendKeys(gemini.TAB);
      });
  });

  gemini.suite('styling', function(suite) {
    suite
      .setUrl('styling.html')
      .setCaptureElements('vaadin-button')
      .capture('default', {}, wait);
  });

});
