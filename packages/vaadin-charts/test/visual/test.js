gemini.suite('vaadin-charts', function(rootSuite) {
  function wait(actions, find) {
    actions.wait(7000);
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

  gemini.suite('empty-chart', function(suite) {
    suite
      .setUrl('/default.html')
      .setCaptureElements('vaadin-chart')
      .capture('empty-chart');
  });

});
