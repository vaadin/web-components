gemini.suite('vaadin-date-time-picker', function(rootSuite) {
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
        .capture('default');
    });

    gemini.suite(`flex-behaviour-${theme}`, function(suite) {
      suite
        .setUrl(`/flex-behaviour.html?theme=${theme}`)
        .setCaptureElements('#flex-behaviour-tests')
        .capture('default')
        .capture('small-container', function(actions) {
          actions.executeJS(function(window) {
            const container = window.document.querySelector('#flex-behaviour-tests');
            container.style.display = 'block';
            container.style.width = '235px';
          });
        });
    });

    gemini.suite(`alignment-${theme}`, function(suite) {
      suite
        .setUrl(`/alignment.html?theme=${theme}`)
        .setCaptureElements('#alignment-tests')
        .capture('default');
    });
  });

});
