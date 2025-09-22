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

  describe('with header slot', () => {
    beforeEach(async () => {
      const headerDiv = document.createElement('div');
      headerDiv.setAttribute('slot', 'header');
      headerDiv.style.height = '50px';
      headerDiv.textContent = 'Header Slot Content';
      grid.appendChild(headerDiv);
      flushGrid(grid);
      await nextResize(grid);
    });

    it('should include header slot height in min-height', () => {
      const height = grid.getBoundingClientRect().height;
      const headerSlotHeight = grid.shadowRoot.querySelector('#gridHeader').getBoundingClientRect().height;
      expect(headerSlotHeight).to.be.above(0);
      expect(height).to.be.at.least(rowHeight + headerSlotHeight);
    });
  });

  describe('with footer slot', () => {
    beforeEach(async () => {
      const footerDiv = document.createElement('div');
      footerDiv.setAttribute('slot', 'footer');
      footerDiv.style.height = '40px';
      footerDiv.textContent = 'Footer Slot Content';
      grid.appendChild(footerDiv);
      flushGrid(grid);
      await nextResize(grid);
    });

    it('should include footer slot height in min-height', () => {
      const height = grid.getBoundingClientRect().height;
      const footerSlotHeight = grid.shadowRoot.querySelector('#gridFooter').getBoundingClientRect().height;
      expect(footerSlotHeight).to.be.above(0);
      expect(height).to.be.at.least(rowHeight + footerSlotHeight);
    });
  });

  describe('with header and footer slots', () => {
    beforeEach(async () => {
      const headerDiv = document.createElement('div');
      headerDiv.setAttribute('slot', 'header');
      headerDiv.style.height = '50px';
      headerDiv.textContent = 'Header Slot Content';
      grid.appendChild(headerDiv);

      const footerDiv = document.createElement('div');
      footerDiv.setAttribute('slot', 'footer');
      footerDiv.style.height = '40px';
      footerDiv.textContent = 'Footer Slot Content';
      grid.appendChild(footerDiv);

      flushGrid(grid);
      await nextResize(grid);
    });

    it('should include both header and footer slot heights in min-height', () => {
      const height = grid.getBoundingClientRect().height;
      const headerSlotHeight = grid.shadowRoot.querySelector('#gridHeader').getBoundingClientRect().height;
      const footerSlotHeight = grid.shadowRoot.querySelector('#gridFooter').getBoundingClientRect().height;
      expect(headerSlotHeight).to.be.above(0);
      expect(footerSlotHeight).to.be.above(0);
      expect(height).to.be.at.least(rowHeight + headerSlotHeight + footerSlotHeight);
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
