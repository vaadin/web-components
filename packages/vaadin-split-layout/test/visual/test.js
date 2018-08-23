gemini.suite('vaadin-split-layout', function(rootSuite) {
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
  ['lumo', 'material'].forEach(theme => {
    gemini.suite(`default-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#default')
        .capture('default');
    });

    gemini.suite(`customized-${theme}`, function(suite) {
      suite
        .setUrl(`customized.html?theme=${theme}`)
        .setCaptureElements('#customized')
        .capture('customized');
    });
  });

});
