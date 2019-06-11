gemini.suite('vaadin-radio-button', function(rootSuite) {
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
    gemini.suite(`default-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#default-tests')
        .capture('default', function(actions) {
          actions.executeJS(function(window) {
            window.focusRadio();
          });
        });
    });

    gemini.suite(`wrapping-tests-${theme}`, function(suite) {
      suite
        .setUrl(`wrapping.html?theme=${theme}`)
        .setCaptureElements('#wrapping-tests')
        .capture('wrapping');
    });
  });

});
