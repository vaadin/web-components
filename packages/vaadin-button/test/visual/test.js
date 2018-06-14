gemini.suite('vaadin-button', function(rootSuite) {
  function wait(actions, find) {
    actions.wait(5000);
  }

  function goToAboutBlank(actions, find) {
    // Firefox stops responding on socket after a test, workaround:
    return actions.executeJS(function(window) {
      window.location.href = 'about:blank'; // just go away, please!
    });
  }

  rootSuite
    .before(wait)
    .after(goToAboutBlank);

  gemini.suite('default-tests', function(suite) {
    suite
      .setUrl('default.html')
      .setCaptureElements('body')
      .capture('default');
  });

  gemini.suite('colors', function(suite) {
    suite
      .setUrl('colors.html')
      .setCaptureElements('body')
      .capture('default');
  });

  gemini.suite('icons', function(suite) {
    suite
      .setUrl('icons.html')
      .setCaptureElements('body')
      .capture('default');
  });

  gemini.suite('sizing', function(suite) {
    suite
      .setUrl('sizing.html')
      .setCaptureElements('body')
      .capture('default');
  });

  gemini.suite('truncation-expansion', function(suite) {
    suite
      .setUrl('truncation-expansion.html')
      .setCaptureElements('body')
      .capture('default');
  });

  gemini.suite('types', function(suite) {
    suite
      .setUrl('types.html')
      .setCaptureElements('body')
      .capture('default');
  });

});
