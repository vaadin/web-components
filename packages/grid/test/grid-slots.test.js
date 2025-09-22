import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-grid.js';
import '../src/vaadin-grid-column.js';

describe('grid slots', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="name"></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.items = [{ name: 'Item 1' }, { name: 'Item 2' }];
    await nextFrame();
  });

  describe('header slot', () => {
    it('should have a header slot', () => {
      const slot = grid.shadowRoot.querySelector('slot[name="header"]');
      expect(slot).to.exist;
    });

    it('should render content in header slot', async () => {
      const header = document.createElement('div');
      header.slot = 'header';
      header.textContent = 'Grid Header';
      grid.appendChild(header);
      await nextFrame();

      const slot = grid.shadowRoot.querySelector('slot[name="header"]');
      const assignedNodes = slot.assignedNodes();
      expect(assignedNodes.length).to.equal(1);
      expect(assignedNodes[0].textContent).to.equal('Grid Header');
    });

    it('should position header above the table', async () => {
      const header = document.createElement('div');
      header.slot = 'header';
      header.style.height = '50px';
      header.textContent = 'Grid Header';
      grid.appendChild(header);
      await nextFrame();

      const headerPart = grid.shadowRoot.querySelector('[part="header"]');
      const table = grid.shadowRoot.querySelector('#table');

      const headerRect = headerPart.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();

      expect(headerRect.bottom).to.be.at.most(tableRect.top + 1);
    });

    it('should hide empty header slot', () => {
      const headerPart = grid.shadowRoot.querySelector('[part="header"]');
      const computedStyle = window.getComputedStyle(headerPart);
      expect(computedStyle.display).to.equal('none');
    });

    it('should show header slot with content', async () => {
      const header = document.createElement('div');
      header.slot = 'header';
      header.textContent = 'Grid Header';
      grid.appendChild(header);
      await nextFrame();

      const headerPart = grid.shadowRoot.querySelector('[part="header"]');
      const computedStyle = window.getComputedStyle(headerPart);
      expect(computedStyle.display).to.equal('flex');
    });

    it('should use flexbox layout for header', async () => {
      const header1 = document.createElement('span');
      header1.slot = 'header';
      header1.textContent = 'Left';
      grid.appendChild(header1);

      const header2 = document.createElement('span');
      header2.slot = 'header';
      header2.textContent = 'Right';
      header2.style.marginLeft = 'auto';
      grid.appendChild(header2);

      await nextFrame();

      const headerPart = grid.shadowRoot.querySelector('[part="header"]');
      const computedStyle = window.getComputedStyle(headerPart);
      expect(computedStyle.display).to.equal('flex');
      expect(computedStyle.alignItems).to.equal('center');
    });
  });

  describe('footer slot', () => {
    it('should have a footer slot', () => {
      const slot = grid.shadowRoot.querySelector('slot[name="footer"]');
      expect(slot).to.exist;
    });

    it('should render content in footer slot', async () => {
      const footer = document.createElement('div');
      footer.slot = 'footer';
      footer.textContent = 'Grid Footer';
      grid.appendChild(footer);
      await nextFrame();

      const slot = grid.shadowRoot.querySelector('slot[name="footer"]');
      const assignedNodes = slot.assignedNodes();
      expect(assignedNodes.length).to.equal(1);
      expect(assignedNodes[0].textContent).to.equal('Grid Footer');
    });

    it('should position footer below the table', async () => {
      const footer = document.createElement('div');
      footer.slot = 'footer';
      footer.style.height = '50px';
      footer.textContent = 'Grid Footer';
      grid.appendChild(footer);
      await nextFrame();

      const footerPart = grid.shadowRoot.querySelector('[part="footer"]');
      const table = grid.shadowRoot.querySelector('#table');

      const footerRect = footerPart.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();

      expect(footerRect.top).to.be.at.least(tableRect.bottom - 1);
    });

    it('should hide empty footer slot', () => {
      const footerPart = grid.shadowRoot.querySelector('[part="footer"]');
      const computedStyle = window.getComputedStyle(footerPart);
      expect(computedStyle.display).to.equal('none');
    });

    it('should show footer slot with content', async () => {
      const footer = document.createElement('div');
      footer.slot = 'footer';
      footer.textContent = 'Grid Footer';
      grid.appendChild(footer);
      await nextFrame();

      const footerPart = grid.shadowRoot.querySelector('[part="footer"]');
      const computedStyle = window.getComputedStyle(footerPart);
      expect(computedStyle.display).to.equal('flex');
    });

    it('should use flexbox layout for footer', async () => {
      const footer1 = document.createElement('span');
      footer1.slot = 'footer';
      footer1.textContent = 'Status';
      grid.appendChild(footer1);

      const footer2 = document.createElement('span');
      footer2.slot = 'footer';
      footer2.textContent = 'Info';
      footer2.style.marginLeft = 'auto';
      grid.appendChild(footer2);

      await nextFrame();

      const footerPart = grid.shadowRoot.querySelector('[part="footer"]');
      const computedStyle = window.getComputedStyle(footerPart);
      expect(computedStyle.display).to.equal('flex');
      expect(computedStyle.alignItems).to.equal('center');
    });
  });

  describe('header and footer together', () => {
    it('should render both header and footer', async () => {
      const header = document.createElement('div');
      header.slot = 'header';
      header.textContent = 'Grid Header';
      grid.appendChild(header);

      const footer = document.createElement('div');
      footer.slot = 'footer';
      footer.textContent = 'Grid Footer';
      grid.appendChild(footer);

      await nextFrame();

      const headerSlot = grid.shadowRoot.querySelector('slot[name="header"]');
      const footerSlot = grid.shadowRoot.querySelector('slot[name="footer"]');

      expect(headerSlot.assignedNodes()[0].textContent).to.equal('Grid Header');
      expect(footerSlot.assignedNodes()[0].textContent).to.equal('Grid Footer');
    });

    it('should maintain correct layout with both header and footer', async () => {
      const header = document.createElement('div');
      header.slot = 'header';
      header.style.height = '50px';
      header.textContent = 'Grid Header';
      grid.appendChild(header);

      const footer = document.createElement('div');
      footer.slot = 'footer';
      footer.style.height = '40px';
      footer.textContent = 'Grid Footer';
      grid.appendChild(footer);

      await nextFrame();

      const headerPart = grid.shadowRoot.querySelector('[part="header"]');
      const footerPart = grid.shadowRoot.querySelector('[part="footer"]');
      const table = grid.shadowRoot.querySelector('#table');

      const headerRect = headerPart.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();
      const footerRect = footerPart.getBoundingClientRect();

      expect(headerRect.bottom).to.be.at.most(tableRect.top + 1);
      expect(footerRect.top).to.be.at.least(tableRect.bottom - 1);
    });
  });
});
