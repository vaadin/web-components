import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { ComboBoxPlaceholder } from '../src/vaadin-combo-box-placeholder.js';
import { createRangeDataProvider } from '../src/vaadin-combo-box-range-data-provider.js';
import { isPageInRange } from '../src/vaadin-combo-box-range-data-provider-helpers.js';
import { makeItems, scrollToIndex } from './helpers.js';

const ITEMS = makeItems(480);

describe('range data provider', () => {
  let comboBox;

  function expectLoadedPagesToBeWithinRange(range) {
    comboBox.filteredItems.forEach((item, i) => {
      const page = Math.floor(i / comboBox.pageSize);
      if (isPageInRange(range, page)) {
        expect(item).to.equal(`item ${i}`, `Page ${page}`);
      } else {
        expect(item).to.be.an.instanceOf(ComboBoxPlaceholder, `Page ${page}`);
      }
    });
  }

  function scrollToFirstIndexOfPage(page) {
    scrollToIndex(comboBox, page * comboBox.pageSize);
  }

  function scrollToLastIndexOfPage(page) {
    scrollToIndex(comboBox, page * comboBox.pageSize + comboBox.pageSize - 1);
  }

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
    comboBox.pageSize = 50;
    comboBox.dataProvider = createRangeDataProvider(
      ({ pageRange, pageSize }, callback) => {
        const items = ITEMS.slice(pageRange[0] * pageSize, (pageRange[1] + 1) * pageSize);
        const itemsByPage = items.reduce((pages, item, i) => {
          const page = pageRange[0] + Math.floor(i / comboBox.pageSize);
          pages[page] ||= [];
          pages[page].push(item);
          return pages;
        }, {});

        callback(itemsByPage, ITEMS.length);
      },
      {
        maxRangeSize: 5,
      },
    );
    comboBox.open();
    await nextFrame();
  });

  it('should have first page loaded', () => {
    expectLoadedPagesToBeWithinRange([0, 0]);
  });

  it('should load more pages as the user scrolls down', async () => {
    for (let page = 0; page < 5; page++) {
      scrollToFirstIndexOfPage(page);
      await nextFrame();
      expect(comboBox.loading).to.be.false;
      expectLoadedPagesToBeWithinRange([0, page]);
    }
  });

  it('should discard pages out of range as the user scrolls down', async () => {
    for (let page = 0; page <= 5; page++) {
      scrollToFirstIndexOfPage(page);
      await nextFrame();
    }

    expect(comboBox.loading).to.be.false;
    expectLoadedPagesToBeWithinRange([1, 5]);
  });

  it('should load more pages as the user scrolls up', async () => {
    for (let page = 9; page > 4; page--) {
      scrollToLastIndexOfPage(page);
      await nextFrame();
      expect(comboBox.loading).to.be.false;
      expectLoadedPagesToBeWithinRange([page, 9]);
    }
  });

  it('should discard pages out of range as the user scrolls up', async () => {
    for (let page = 9; page >= 4; page--) {
      scrollToLastIndexOfPage(page);
      await nextFrame();
    }

    expect(comboBox.loading).to.be.false;
    expectLoadedPagesToBeWithinRange([4, 8]);
  });
});
