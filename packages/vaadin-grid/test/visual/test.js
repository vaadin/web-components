gemini.suite('vaadin-grid', (rootSuite) => {

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
      .before((actions, find) => {
        this.firstNameSorter = find('#first-name-sorter');
        this.lastNameSorter = find('#last-name-sorter');
      })
      .capture('sorting-initial', {}, (actions, find) => {
        actions.wait(6000);
      })
      .capture('single-column-asc', {}, (actions, find) => {
        actions.click(this.firstNameSorter);
      })
      .capture('multiple-columns-asc-asc', {}, (actions, find) => {
        actions.click(this.lastNameSorter);
      })
      .capture('multiple-columns-asc-desc', {}, (actions, find) => {
        const sorter = find('#last-name-sorter');
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
