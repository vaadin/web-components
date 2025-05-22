import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextResize } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import { flushGrid, infiniteDataProvider } from './helpers.js';

describe('min-height', () => {
  const rowHeight = 36;

  let grid;

  function verifyMinHeight(withHeader = false, withFooter = false) {
    const height = grid.getBoundingClientRect().height;

    const headerHeight = grid.$.header.getBoundingClientRect().height;
    if (withHeader) {
      expect(headerHeight).to.be.above(0);
    } else {
      expect(headerHeight).to.equal(0);
    }

    const footerHeight = grid.$.footer.getBoundingClientRect().height;
    if (withFooter) {
      expect(footerHeight).to.be.above(0);
    } else {
      expect(footerHeight).to.equal(0);
    }

    const expectedHeight = rowHeight + headerHeight + footerHeight;
    expect(height).to.equal(expectedHeight);
  }

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="height: 0;">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    flushGrid(grid);
    await nextResize(grid);
  });

  describe('without header or footer', () => {
    it('should have min-height of one row', () => {
      verifyMinHeight();
    });
  });

  describe('with header', () => {
    beforeEach(async () => {
      grid.querySelector('vaadin-grid-column').header = 'Header';
      flushGrid(grid);
      await nextResize(grid);
    });

    it('should have min-height of header and one row', () => {
      verifyMinHeight(true, false);
    });
  });

  describe('with footer', () => {
    beforeEach(async () => {
      grid.querySelector('vaadin-grid-column').footerRenderer = (root) => {
        root.textContent = 'Footer';
      };
      flushGrid(grid);
      await nextResize(grid);
    });

    it('should have min-height of footer and one row', () => {
      verifyMinHeight(false, true);
    });
  });

  describe('with header and footer', () => {
    beforeEach(async () => {
      grid.querySelector('vaadin-grid-column').header = 'Header';
      grid.querySelector('vaadin-grid-column').footerRenderer = (root) => {
        root.textContent = 'Footer';
      };
      flushGrid(grid);
      await nextResize(grid);
    });

    it('should have min-height of header, footer and one row', () => {
      verifyMinHeight(true, true);
    });
  });

  describe('with data', () => {
    beforeEach(async () => {
      grid.querySelector('vaadin-grid-column').path = 'value';
      grid.querySelector('vaadin-grid-column').header = null;
      grid.dataProvider = infiniteDataProvider;
      flushGrid(grid);
      await nextResize(grid);
    });

    it('should have min-height of one row', () => {
      verifyMinHeight();
    });
  });

  describe('override', () => {
    beforeEach(() => {
      fixtureSync(`
        <style>
          vaadin-grid {
            min-height: 200px;
          }
        </style>
      `);
    });

    it('should allow overriding min-height through stylesheet', () => {
      const height = grid.getBoundingClientRect().height;
      expect(height).to.equal(200);
    });
  });
});
