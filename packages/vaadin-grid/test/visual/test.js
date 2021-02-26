describe('vaadin-grid', () => {
  const locator = '#grid-tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    ['ltr', 'rtl'].forEach((direction) => {
      it(`header-footer-${theme}-${direction}`, function () {
        return this.browser
          .url(`header-footer.html?theme=${theme}&dir=${direction}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-header-footer-${direction}`, locator);
      });

      it(`column-groups-${theme}-${direction}`, function () {
        return this.browser
          .url(`column-groups.html?theme=${theme}&dir=${direction}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-column-groups-${direction}`, locator);
      });

      it(`row-details-${theme}-${direction}`, function () {
        return this.browser
          .url(`row-details.html?theme=${theme}&dir=${direction}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-row-details-collapsed-${direction}`, locator)
          .execute(() => {
            const grid = window.document.querySelector('vaadin-grid');
            grid.openItemDetails(grid.items[0]);
          })
          .assertView(`${theme}-row-details-expanded-${direction}`, locator);
      });

      it(`sorting-${theme}-${direction}`, function () {
        return this.browser
          .url(`sorting.html?theme=${theme}&dir=${direction}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-sorting-initial-${direction}`, locator)
          .click('#first-name-sorter')
          .assertView(`${theme}-sorting-single-asc-${direction}`, locator)
          .click('#last-name-sorter')
          .assertView(`${theme}-sorting-multi-asc-asc-${direction}`, locator)
          .click('#last-name-sorter')
          .assertView(`${theme}-sorting-multi-asc-desc-${direction}`, locator)
          .click('#last-name-sorter')
          .click('#first-name-sorter')
          .assertView(`${theme}-sorting-single-desc-${direction}`, locator);
      });
    });

    it(`drag-and-drop-${theme}`, function () {
      return this.browser
        .url(`drag-and-drop.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .execute(() => {
          const grid = window.document.querySelector('vaadin-grid');
          grid.setAttribute('dragover', '');
        })
        .assertView(`${theme}-grid-dragover`, locator)
        .execute(() => {
          const grid = window.document.querySelector('vaadin-grid');
          grid.removeAttribute('dragover');
          grid.$.items.children[1].setAttribute('dragover', 'on-top');
        })
        .assertView(`${theme}-row-dragover-on-top`, locator)
        .execute(() => {
          const grid = window.document.querySelector('vaadin-grid');
          grid.$.items.children[1].setAttribute('dragover', 'above');
        })
        .assertView(`${theme}-row-dragover-above`, locator)
        .execute(() => {
          const grid = window.document.querySelector('vaadin-grid');
          grid.$.items.children[1].setAttribute('dragover', 'below');
        })
        .assertView(`${theme}-row-dragover-below`, locator)
        .execute(() => {
          const grid = window.document.querySelector('vaadin-grid');
          grid.detailsOpenedItems = [grid.items[1]];
          grid.$.items.children[1].setAttribute('dragover', 'above');
        })
        .assertView(`${theme}-row-dragover-above-details`, locator)
        .execute(() => {
          const grid = window.document.querySelector('vaadin-grid');
          grid.detailsOpenedItems = [grid.items[1]];
          grid.$.items.children[1].setAttribute('dragover', 'below');
        })
        .assertView(`${theme}-row-dragover-below-details`, locator)
        .execute(() => {
          const grid = window.document.querySelector('vaadin-grid');
          grid.detailsOpenedItems = [];
          grid.$.items.children[1].removeAttribute('dragover');
          grid.$.items.children[1].setAttribute('dragstart', '123');
        })
        .assertView(`${theme}-row-dragstart`, locator);
    });
  });
});
