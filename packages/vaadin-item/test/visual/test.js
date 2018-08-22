gemini.suite('vaadin-item', function(rootSuite) {
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
    gemini.suite(`vaadin-item-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#default-tests')
        .capture('default');
    });
  });

});
