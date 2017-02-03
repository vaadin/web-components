

gemini.suite('vaadin-input', function(rootSuite) {
  // Hack needed for
  // - Edge (https://github.com/vaadin/vaadin-input/issues/10)
  // - Making sure that animations have finished
  // - FF has async focused the input.
  function wait(actions, find) {
    actions.wait(3000);
  }

  gemini.suite('visual-tests', function(suite) {
    suite
      .setUrl('/index.html')
      .setCaptureElements('#visual-tests')
      .capture('visual-tests', {}, wait);
  });

  gemini.suite('theming-tests', function(suite) {
    suite
      .setUrl('/material-design.html')
      .setCaptureElements('#material-design')
      .capture('material-design', {}, wait);
  });
});
