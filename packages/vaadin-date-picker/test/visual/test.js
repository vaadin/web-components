gemini.suite('vaadin-date-picker', function(rootSuite) {
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

  gemini.suite('default-tests', function(suite) {
    suite
      .setUrl('default.html')
      .setCaptureElements('#default-tests')
      .capture('default');
  });

  gemini.suite('dropdown', function(suite) {
    suite
      .setUrl('dropdown.html')
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