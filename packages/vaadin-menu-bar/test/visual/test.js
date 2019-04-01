gemini.suite('vaadin-menu-bar', function(rootSuite) {
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
        .capture('default', function(actions) {
          actions.executeJS(function(window) {
            window.openSubMenu();
          });
        });
    });

    gemini.suite(`overflow-tests-${theme}`, function(suite) {
      suite
        .setUrl(`overflow.html?theme=${theme}`)
        .setCaptureElements('#overflow-tests')
        .capture('overflow', function(actions) {
          actions.executeJS(function(window) {
            window.openSubMenu();
          });
        });
    });

    if (theme === 'material') {
      gemini.suite(`theme-variants-tests-${theme}`, function(suite) {
        suite
          .setUrl(`theme-variants.html?theme=${theme}`)
          .setCaptureElements('#theme-variants-tests')
          .capture('theme-variants-1', function(actions) {
            actions.executeJS(function(window) {
              window.openSubMenu(0);
            });
          })
          .capture('theme-variants-2', function(actions) {
            actions.executeJS(function(window) {
              window.closeSubMenus();
              window.openSubMenu(1);
            });
          });
      });
    }
  });

});
