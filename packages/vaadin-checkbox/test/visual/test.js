gemini.suite('vaadin-checkbox', function(rootSuite) {
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
        .capture('default')
        .capture('focus-ring', function(actions) {
          actions.executeJS(function(window) {
            window.document.querySelector('vaadin-checkbox').setAttribute('focus-ring', '');
          });
        })
        .capture('checked', function(actions) {
          actions.executeJS(function(window) {
            window.document.querySelector('vaadin-checkbox').checked = true;
          });
        });
    });

    gemini.suite(`group-tests-${theme}`, (suite) => {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#group-tests')
        .capture('default');
    });

    gemini.suite(`validation-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#validation-tests')
        .capture('error');
    });

  });

});
