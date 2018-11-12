gemini.suite('vaadin-rich-text-editor', function(rootSuite) {
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
    ['min-height', 'max-height', 'default', 'disabled', 'readonly'].forEach(state => {
      gemini.suite(`${state}-${theme}`, function(suite) {
        suite
          .setUrl(`/${state}.html?theme=${theme}`)
          .setCaptureElements(`#${state}`)
          .capture(`vaadin-rich-text-editor`);
      });
    });
  });

});
