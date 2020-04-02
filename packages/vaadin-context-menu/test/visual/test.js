gemini.suite('vaadin-context-menu', function(rootSuite) {
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
    ['rtl', 'ltr'].forEach(dir => {

      gemini.suite(`default-tests-${theme}-${dir}`, function(suite) {
        suite
          .setUrl(`default.html?theme=${theme}&dir=${dir}`)
          .setCaptureElements('#default-tests')
          .capture('default', function(actions) {
            actions.executeJS(function(window) {
              window.contextmenu(window.document.querySelector('#plain'));
            });
          })
          .capture('long-menu', function(actions) {
            actions.executeJS(function(window) {
              window.contextmenu(window.document.querySelector('#long'));
            });
          })
          .capture('bottom-menu', function(actions) {
            actions.executeJS(function(window) {
              window.contextmenu(window.document.querySelector('#bottom'));
            });
          })
          .capture('items', function(actions) {
            actions.executeJS(function(window) {
              window.contextmenu(window.document.querySelector('#items'));
            });
          });
      });
    });
  });

});
