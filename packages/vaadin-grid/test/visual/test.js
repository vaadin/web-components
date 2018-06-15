gemini.suite('vaadin-grid', (rootSuite) => {

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

  gemini.suite('header-footer', (suite) => {
    suite
      .setUrl('header-footer.html')
      .setCaptureElements('#header-footer')
      .capture('header-footer', {}, (actions, find) => {
        actions.wait(6000);
      });
  });

  gemini.suite('column-groups', (suite) => {
    suite
      .setUrl('column-groups.html')
      .setCaptureElements('#column-groups')
      .capture('column-groups', {}, (actions, find) => {
        actions.wait(6000);
      });
  });

  gemini.suite('sorting', (suite) => {
    suite
      .setUrl('sorting.html')
      .setCaptureElements('#sorting')
      .capture('sorting-initial', {}, (actions, find) => {
        actions.wait(6000);
      })
      .before((actions, find) => {
        this.firstNameSorter = find('#first-name-sorter');
        this.lastNameSorter = find('#last-name-sorter');
      })
      .capture('single-column-asc', {}, (actions, find) => {
        actions.click(this.firstNameSorter);
      })
      .capture('multiple-columns-asc-asc', {}, (actions, find) => {
        actions.click(this.lastNameSorter);
      })
      .capture('multiple-columns-asc-desc', {}, (actions, find) => {
        actions.click(this.lastNameSorter);
      })
      .capture('single-column-desc', {}, (actions, find) => {
        actions.click(this.lastNameSorter);
        actions.click(this.firstNameSorter);
      });
  });

  gemini.suite('row-details', (suite) => {
    suite
      .setUrl('row-details.html')
      .setCaptureElements('#row-details')
      .capture('row-details-initial', {}, (actions, find) => {
        actions.wait(6000);
      })
      .capture('row-details-visible', {}, (actions, find) => {
        actions.executeJS(function(window) {
          var grid = window.document.querySelector('vaadin-grid');
          grid.openItemDetails(grid.items[0]);
        });
      });
  });

});
