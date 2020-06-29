gemini.suite('vaadin-avatar', function(rootSuite) {
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
        .setUrl(`/default.html?theme=${theme}`)
        .setCaptureElements('#default-tests')
        .capture(`vaadin-avatar`);
    });

    gemini.suite(`scaled-tests-${theme}`, function(suite) {
      suite
        .setUrl(`/scaled.html?theme=${theme}`)
        .setCaptureElements('#scaled-tests')
        .capture(`vaadin-avatar`);
    });
  });

  ['light', 'dark'].forEach(variant => {
    gemini.suite(`lumo-${variant}`, function(suite) {
      suite
        .setUrl(`/lumo.html?variant=${variant}`)
        .setCaptureElements('#default-tests')
        .capture(`vaadin-avatar`);
    });
  });
});
