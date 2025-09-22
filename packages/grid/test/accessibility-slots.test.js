import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
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
    it('should allow Tab navigation from header to grid', async () => {
      const addButton = grid.querySelector('#addBtn');
      const searchInput = grid.querySelector('#searchInput');

      // Focus the first button in header
      addButton.focus();
      expect(document.activeElement).to.equal(addButton);

      // Tab to search input
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(searchInput);

      // Tab to grid - should focus a header cell
      await sendKeys({ press: 'Tab' });
      const activeElement = grid.shadowRoot.activeElement;
      expect(activeElement).to.exist;
      expect(activeElement.getAttribute('role')).to.equal('columnheader');
    });

    it('should allow Tab navigation from grid to footer', async () => {
      // Focus the search input in header first
      const searchInput = grid.querySelector('#searchInput');
      searchInput.focus();
      expect(document.activeElement).to.equal(searchInput);

      // Tab into grid
      await sendKeys({ press: 'Tab' });

      // Focus should be in the grid (on a cell in shadow DOM)
      expect(document.activeElement).to.equal(grid);
      expect(grid.shadowRoot.activeElement).to.exist;
      expect(grid.shadowRoot.activeElement.getAttribute('role')).to.be.oneOf(['columnheader', 'gridcell']);

      // Tab out of grid - Grid's internal Tab handling exits the grid
      // Note: The grid may handle Tab internally and exit on the first Tab press
      // or may require multiple Tab presses depending on its internal state
      let attempts = 0;
      const maxAttempts = 5;

      while (document.activeElement !== grid.querySelector('#nextBtn') && attempts < maxAttempts) {
        await sendKeys({ press: 'Tab' });
        attempts += 1;
      }

      // After exiting grid, focus should be on the footer button
      expect(document.activeElement.id).to.equal('nextBtn');
    });

    it('should allow Shift+Tab navigation from footer back to grid', async () => {
      const nextButton = grid.querySelector('#nextBtn');

      // Focus footer button
      nextButton.focus();
      expect(document.activeElement).to.equal(nextButton);

      // Shift+Tab should go back to grid
      await sendKeys({ press: 'Shift+Tab' });

      // Should be in the grid now
      const activeElement = grid.shadowRoot.activeElement;
      expect(activeElement).to.exist;
      expect(activeElement.getAttribute('role')).to.be.oneOf(['columnheader', 'gridcell']);
    });

    it('should allow Shift+Tab navigation from grid to header', async () => {
      // Focus grid first
      const table = grid.shadowRoot.querySelector('#table');
      table.focus();

      // Shift+Tab should go to header content
      await sendKeys({ press: 'Shift+Tab' });

      // Should be in header (search input is last in header)
      expect(document.activeElement.id).to.equal('searchInput');
    });

    it('should maintain grid table keyboard navigation', async () => {
      const table = grid.shadowRoot.querySelector('#table');
      table.focus();

      // When the table is focused, the actual focus goes to a cell
      const initialActiveElement = grid.shadowRoot.activeElement;
      expect(initialActiveElement).to.exist;
      expect(initialActiveElement.getAttribute('role')).to.be.oneOf(['columnheader', 'gridcell']);

      // Arrow keys should work within grid
      await sendKeys({ press: 'ArrowRight' });
      const afterArrowRight = grid.shadowRoot.activeElement;
      expect(afterArrowRight).to.exist;
      expect(afterArrowRight).to.not.equal(initialActiveElement);
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
    it('should not trap focus in header', async () => {
      const addButton = grid.querySelector('#addBtn');
      const searchInput = grid.querySelector('#searchInput');

      addButton.focus();
      expect(document.activeElement).to.equal(addButton);

      // Tab within header
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(searchInput);

      // Tab out of header to grid
      await sendKeys({ press: 'Tab' });
      expect(grid.shadowRoot.activeElement).to.exist;
      expect(grid.shadowRoot.activeElement.getAttribute('role')).to.equal('columnheader');
    });

    it('should not trap focus in footer', async () => {
      const nextButton = grid.querySelector('#nextBtn');
      nextButton.focus();
      expect(document.activeElement).to.equal(nextButton);

      // Shift+Tab should go back to grid
      await sendKeys({ press: 'Shift+Tab' });
      expect(grid.shadowRoot.activeElement).to.exist;
    });

    it('should maintain proper Tab focus order through entire grid', async () => {
      const addButton = grid.querySelector('#addBtn');

      // Start from header
      addButton.focus();
      expect(document.activeElement).to.equal(addButton);

      // Tab through header
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement.id).to.equal('searchInput');

      // Tab into grid
      await sendKeys({ press: 'Tab' });
      expect(grid.shadowRoot.activeElement).to.exist;
      expect(grid.shadowRoot.activeElement.getAttribute('role')).to.equal('columnheader');

      // Tab out of grid - Grid handles Tab navigation and exits to footer
      let attempts = 0;
      const maxAttempts = 5;

      while (document.activeElement !== grid.querySelector('#nextBtn') && attempts < maxAttempts) {
        await sendKeys({ press: 'Tab' });
        attempts += 1;
      }

      // Should reach footer
      expect(document.activeElement.id).to.equal('nextBtn');
    });

    it('should support reverse Tab navigation', async () => {
      const nextButton = grid.querySelector('#nextBtn');

      // Start from footer
      nextButton.focus();
      expect(document.activeElement).to.equal(nextButton);

      // Shift+Tab back through grid to header
      let shiftTabCount = 0;
      const maxShiftTabs = 15;

      while (document.activeElement.id !== 'searchInput' && shiftTabCount < maxShiftTabs) {
        await sendKeys({ press: 'Shift+Tab' });
        shiftTabCount += 1;
      }

      // Should reach header search input
      expect(document.activeElement.id).to.equal('searchInput');

      // One more Shift+Tab to reach add button
      await sendKeys({ press: 'Shift+Tab' });
      expect(document.activeElement.id).to.equal('addBtn');
    });
  });
});
