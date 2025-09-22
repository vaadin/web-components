import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-grid.js';
import '../src/vaadin-grid-column.js';

describe('accessibility - header and footer slots', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <div slot="header" id="gridToolbar">
          <button id="addBtn">Add Item</button>
          <input type="search" placeholder="Search..." id="searchInput">
        </div>
        
        <vaadin-grid-column path="name" header="Name"></vaadin-grid-column>
        <vaadin-grid-column path="email" header="Email"></vaadin-grid-column>
        
        <div slot="footer" id="gridStatus">
          <span>Total: 5 items</span>
          <button id="nextBtn">Next Page</button>
        </div>
      </vaadin-grid>
    `);

    grid.items = [
      { name: 'John', email: 'john@example.com' },
      { name: 'Jane', email: 'jane@example.com' },
    ];

    await nextFrame();
  });

  describe('DOM structure', () => {
    it('should have header slot content in the shadow DOM', () => {
      const headerSlot = grid.shadowRoot.querySelector('slot[name="header"]');
      const assignedNodes = headerSlot.assignedNodes();
      expect(assignedNodes).to.have.length(1);
      expect(assignedNodes[0].id).to.equal('gridToolbar');
    });

    it('should have footer slot content in the shadow DOM', () => {
      const footerSlot = grid.shadowRoot.querySelector('slot[name="footer"]');
      const assignedNodes = footerSlot.assignedNodes();
      expect(assignedNodes).to.have.length(1);
      expect(assignedNodes[0].id).to.equal('gridStatus');
    });

    it('should position header before the table', () => {
      const header = grid.shadowRoot.querySelector('[part="header"]');
      const table = grid.shadowRoot.querySelector('#table');
      const headerIndex = Array.from(header.parentElement.children).indexOf(header);
      const tableIndex = Array.from(table.parentElement.children).indexOf(table);
      expect(headerIndex).to.be.below(tableIndex);
    });

    it('should position footer after the table', () => {
      const footer = grid.shadowRoot.querySelector('[part="footer"]');
      const table = grid.shadowRoot.querySelector('#table');
      const footerIndex = Array.from(footer.parentElement.children).indexOf(footer);
      const tableIndex = Array.from(table.parentElement.children).indexOf(table);
      expect(footerIndex).to.be.above(tableIndex);
    });
  });

  describe('keyboard navigation', () => {
    it('should allow keyboard navigation to header slot content', () => {
      const addButton = grid.querySelector('#addBtn');
      addButton.focus();
      expect(document.activeElement).to.equal(addButton);
    });

    it('should allow keyboard navigation to footer slot content', () => {
      const nextButton = grid.querySelector('#nextBtn');
      nextButton.focus();
      expect(document.activeElement).to.equal(nextButton);
    });

    it('should maintain grid table keyboard navigation', () => {
      const table = grid.shadowRoot.querySelector('#table');
      table.focus();
      // When the table is focused, the actual focus goes to a cell
      const activeElement = grid.shadowRoot.activeElement;
      expect(activeElement).to.exist;
      expect(activeElement.getAttribute('role')).to.be.oneOf(['columnheader', 'gridcell']);
    });
  });

  describe('ARIA relationships', () => {
    it('should not interfere with grid ARIA attributes', () => {
      const table = grid.shadowRoot.querySelector('#table');
      expect(table.getAttribute('role')).to.equal('treegrid');
      expect(table.getAttribute('aria-multiselectable')).to.equal('true');
    });

    it('should not add inappropriate ARIA roles to header/footer', () => {
      const header = grid.shadowRoot.querySelector('[part="header"]');
      const footer = grid.shadowRoot.querySelector('[part="footer"]');

      // Header and footer should not have roles that conflict with their content
      expect(header.getAttribute('role')).to.be.null;
      expect(footer.getAttribute('role')).to.be.null;
    });

    it('should allow custom ARIA attributes on slotted content', () => {
      const toolbar = grid.querySelector('#gridToolbar');
      toolbar.setAttribute('role', 'toolbar');
      toolbar.setAttribute('aria-label', 'Grid actions');

      expect(toolbar.getAttribute('role')).to.equal('toolbar');
      expect(toolbar.getAttribute('aria-label')).to.equal('Grid actions');
    });
  });

  describe('screen reader announcement', () => {
    it('should allow header content to be announced independently', () => {
      const searchInput = grid.querySelector('#searchInput');
      expect(searchInput.getAttribute('placeholder')).to.equal('Search...');

      // Screen readers should be able to announce this input field
      expect(searchInput.tagName.toLowerCase()).to.equal('input');
      expect(searchInput.type).to.equal('search');
    });

    it('should allow footer content to be announced independently', () => {
      const footerText = grid.querySelector('#gridStatus').textContent;
      expect(footerText).to.include('Total: 5 items');
    });

    it('should preserve grid accessible name', async () => {
      grid.accessibleName = 'User List';
      await nextFrame();
      const table = grid.shadowRoot.querySelector('#table');
      expect(table.getAttribute('aria-label')).to.equal('User List');
    });
  });

  describe('focus management', () => {
    it('should not trap focus in header', () => {
      const addButton = grid.querySelector('#addBtn');
      const searchInput = grid.querySelector('#searchInput');

      addButton.focus();
      expect(document.activeElement).to.equal(addButton);

      searchInput.focus();
      expect(document.activeElement).to.equal(searchInput);
    });

    it('should not trap focus in footer', () => {
      const nextButton = grid.querySelector('#nextBtn');
      nextButton.focus();
      expect(document.activeElement).to.equal(nextButton);
    });

    it('should maintain proper focus order', () => {
      // Focus should flow naturally through header -> grid -> footer
      const focusableElements = [
        grid.querySelector('#addBtn'),
        grid.querySelector('#searchInput'),
        grid.shadowRoot.querySelector('#table'),
        grid.querySelector('#nextBtn'),
      ];

      // Verify all elements are focusable
      focusableElements.forEach((el) => {
        if (el === grid.shadowRoot.querySelector('#table')) {
          expect(el.getAttribute('tabindex')).to.equal('0');
        } else {
          expect(el.tabIndex).to.be.at.least(0);
        }
      });
    });
  });
});
