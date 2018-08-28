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
  ['lumo', 'material'].forEach(theme => {
    gemini.suite(`default-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('default');
    });

    gemini.suite(`colors-${theme}`, function(suite) {
      suite
        .setUrl(`colors.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('default');
    });

    gemini.suite(`icons-${theme}`, function(suite) {
      suite
        .setUrl(`icons.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('default');
    });

    gemini.suite(`sizing-${theme}`, function(suite) {
      suite
        .setUrl(`sizing.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('default');
    });

    gemini.suite(`truncation-expansion-${theme}`, function(suite) {
      suite
        .setUrl(`truncation-expansion.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('default');
    });

    gemini.suite(`types-${theme}`, function(suite) {
      suite
        .setUrl(`types.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('default');
    });
  });

});
