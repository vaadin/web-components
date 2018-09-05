gemini.suite('vaadin-date-picker', function(rootSuite) {
  function wait(actions, find) {
    return actions
      .waitForJSCondition(function(window) {
        return window.webComponentsAreReady;
      }, 60000);
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
        .capture('default');
    });

    gemini.suite(`dropdown-${theme}`, function(suite) {
      suite
        .setUrl(`dropdown.html?theme=${theme}`)
        .setCaptureElements('body')
        .capture('default', function(actions) {
          actions.executeJS(function(window) {
            window.closeDatePickers();
            window.document.querySelector('#plain').open();
          });
        })
        .capture('selected-value', function(actions) {
          actions.executeJS(function(window) {
            window.closeDatePickers();
            window.document.querySelector('#selected-value').open();
          });
        })
        .capture('date-limit', function(actions) {
          actions.executeJS(function(window) {
            window.closeDatePickers();
            window.document.querySelector('#date-limit').open();
          });
        })
        .capture('week-numbers', function(actions) {
          actions.executeJS(function(window) {
            window.closeDatePickers();
            window.document.querySelector('#weeks').open();
          });
        });
    });
  });

});
