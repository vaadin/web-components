gemini.suite('vaadin-select', function(rootSuite) {
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
        .setUrl(`select.html?theme=${theme}`)
        .setCaptureElements('#select')
        .capture('select');
    });

    gemini.suite(`rtl-tests-${theme}`, function(suite) {
      suite
        .setUrl(`rtl.html?theme=${theme}`)
        .setCaptureElements('#select')
        .capture('select');
    });
  });

  ['ltr', 'rtl'].forEach(dir => {
    gemini.suite(`${dir}-align-tests`, function(suite) {
      suite
        .setUrl(`align-themes.html?dir=${dir}`)
        .setCaptureElements('#select')
        .capture('select');
    });
  });

  gemini.suite(`lumo-variants-tests`, function(suite) {
    suite
      .setUrl(`lumo.html`)
      .setCaptureElements('#select')
      .capture('select');
  });
});
