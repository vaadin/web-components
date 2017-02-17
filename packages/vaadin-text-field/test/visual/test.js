

gemini.suite('vaadin-input', function(rootSuite) {
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

  gemini.suite('styling-tests', function(suite) {
    suite
      .setUrl('/styling.html')
      .setCaptureElements('#styling-tests')
      .capture('screenshots', {}, wait);
  });

  gemini.suite('theming-tests', function(suite) {
    suite
      .setUrl('/theming-md.html')
      .setCaptureElements('#theming-md-tests')
      .capture('screenshots', {}, wait);
  });
});
