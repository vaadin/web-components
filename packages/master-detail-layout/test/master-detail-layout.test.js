import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';

function getColumnWidths(layout) {
  return getComputedStyle(layout)
    .gridTemplateColumns.split(' ')
    .map((width) => parseFloat(width));
}

describe('vaadin-master-detail-layout', () => {
  let layout, master, detail;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <div>Master content</div>
        <div slot="detail">Detail content</div>
      </vaadin-master-detail-layout>
    `);
    await nextRender();
    master = layout.shadowRoot.querySelector('[part="master"]');
    detail = layout.shadowRoot.querySelector('[part="detail"]');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = layout.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('default', () => {
    it('should set height: 100% on the host element for full height columns', () => {
      layout.parentElement.style.height = '400px';
      expect(getComputedStyle(master).height).to.equal('400px');
      expect(getComputedStyle(detail).height).to.equal('400px');
    });

    it('should set column widths by default with both children set', () => {
      const columnWidth = layout.offsetWidth / 2;
      expect(getColumnWidths(layout)).to.eql([columnWidth, columnWidth]);
    });

    it('should use 20em as minimum column width for master and detail parts', () => {
      layout.style.width = 'min-content';
      expect(getColumnWidths(layout)).to.eql([320, 320]);
    });

    it('should show the detail part with the detail child is provided', () => {
      expect(getComputedStyle(detail).display).to.equal('block');
    });

    it('should hide the detail part after the detail child is removed', async () => {
      layout.querySelector('[slot="detail"]').remove();
      await nextRender();
      expect(getComputedStyle(detail).display).to.equal('none');
    });

    it('should update column width after the detail child is removed', async () => {
      layout.querySelector('[slot="detail"]').remove();
      await nextRender();
      expect(getColumnWidths(layout)).to.eql([layout.offsetWidth]);
    });
  });

  describe('overlay', () => {
    it('should not be in the overlay mode by default', () => {
      expect(layout.hasAttribute('overlay')).to.be.false;
    });

    it('should switch to the overlay mode on resize below the threshold', async () => {
      layout.style.maxWidth = '600px';
      await nextResize(layout);
      expect(layout.hasAttribute('overlay')).to.be.true;
    });

    it('should set position: relative on the host in the overlay mode', async () => {
      layout.style.maxWidth = '600px';
      await nextResize(layout);
      expect(getComputedStyle(layout).position).to.equal('relative');
    });

    it('should update column width in the overlay mode', async () => {
      layout.style.maxWidth = '600px';
      await nextResize(layout);
      expect(getColumnWidths(layout)).to.eql([layout.offsetWidth]);
    });

    it('should position the detail part in the overlay mode', async () => {
      layout.style.maxWidth = '600px';
      await nextResize(layout);
      const { position, right } = getComputedStyle(detail);
      expect(position).to.equal('absolute');
      expect(right).to.equal('0px');
    });

    it('should use full height for the detail part in the overlay mode', async () => {
      layout.style.maxWidth = '600px';
      layout.parentElement.style.height = '400px';
      await nextResize(layout);
      expect(getComputedStyle(detail).height).to.equal('400px');
    });
  });

  describe('stack', () => {
    it('should not be in the stack mode by default', () => {
      expect(layout.hasAttribute('overlay')).to.be.false;
    });

    it('should switch to the stack mode on resize below the threshold', async () => {
      layout.style.maxWidth = '300px';
      await nextResize(layout);
      expect(layout.hasAttribute('stack')).to.be.true;
    });

    it('should set display: none on the master part in the stack mode', async () => {
      layout.style.maxWidth = '300px';
      await nextResize(layout);
      expect(getComputedStyle(master).display).to.equal('none');
    });

    it('should not hide the master part in the stack mode when detail is removed', async () => {
      layout.querySelector('[slot="detail"]').remove();
      layout.style.maxWidth = '300px';
      await nextResize(layout);
      expect(getComputedStyle(master).display).to.equal('block');
    });
  });
});
