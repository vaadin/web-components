gemini.suite('vaadin-custom-field', function(rootSuite) {
  function wait(actions, find) {
    return actions
      .waitForJSCondition(function(window) {
        return window.webComponentsAreReady;
      }, 6000);
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
        .capture('focused', function(actions) {
          actions.executeJS(function(window) {
            var customFields = window.document.querySelectorAll('vaadin-custom-field');
            for (var customField of customFields) {
              customField.setAttribute('focused', '');
            }
          });
        });
    });

    gemini.suite(`alignment-tests-${theme}`, function(suite) {
      suite
        .setUrl(`alignment.html?theme=${theme}`)
        .setCaptureElements('#alignment-tests')
        .capture('default');
    });

    gemini.suite(`form-layout-tests-${theme}`, function(suite) {
      suite
        .setUrl(`form-layout.html?theme=${theme}`)
        .setCaptureElements('#form-layout-tests')
        .capture('default');
    });

    gemini.suite(`width-${theme}`, function(suite) {
      suite
        .setUrl(`/width.html?theme=${theme}`)
        .setCaptureElements('#width-tests')
        .capture('default');
    });
  });

});
