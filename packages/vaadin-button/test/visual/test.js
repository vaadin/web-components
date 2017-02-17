gemini.suite('vaadin-button', function(rootSuite) {
  // Hack needed for
  // - Edge (https://github.com/vaadin/vaadin-input/issues/10)
  // - Making sure that animations have finished
  // - FF has async focused the input.
  function wait(actions, find) {
    actions.wait(5000);
  }

  gemini.suite('default-tests', function(suite) {
    suite
      .setUrl('/default.html')
      .setCaptureElements('#default-tests')
      .capture('screenshots', {}, wait);
  });

});
