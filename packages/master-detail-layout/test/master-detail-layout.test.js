import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

describe('vaadin-master-detail-layout', () => {
  let layout, master, detail;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <master-content></master-content>
        <detail-content slot="detail"></detail-content>
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
    it('should set height: 100% on the host element to expand to full height', () => {
      layout.parentElement.style.height = '1000px';
      expect(getComputedStyle(master).height).to.equal('1000px');
      expect(getComputedStyle(detail).height).to.equal('1000px');
    });

    it('should show the detail part with the detail child is provided', () => {
      expect(getComputedStyle(detail).display).to.equal('block');
    });

    it('should hide the detail part after the detail child is removed', async () => {
      layout.querySelector('[slot="detail"]').remove();
      await nextRender();
      expect(getComputedStyle(detail).display).to.equal('none');
    });
  });

  describe('size properties', () => {
    it('should set flex-basis to 50% on the master and detail by default', () => {
      expect(getComputedStyle(master).flexBasis).to.equal('50%');
      expect(getComputedStyle(detail).flexBasis).to.equal('50%');
    });

    it('should set flex-grow to 1% on the master and detail by default', () => {
      expect(getComputedStyle(master).flexGrow).to.equal('1');
      expect(getComputedStyle(detail).flexGrow).to.equal('1');
    });

    it('should set fixed width on the master pane when masterSize is set', () => {
      layout.masterSize = '300px';
      expect(getComputedStyle(master).width).to.equal('300px');
      expect(getComputedStyle(master).flexBasis).to.equal('auto');
      expect(getComputedStyle(master).flexGrow).to.equal('0');
      expect(getComputedStyle(master).flexShrink).to.equal('0');
    });

    it('should set fixed width on the detail pane when detailSize is set', () => {
      layout.detailSize = '300px';
      expect(getComputedStyle(detail).width).to.equal('300px');
      expect(getComputedStyle(detail).flexBasis).to.equal('auto');
      expect(getComputedStyle(detail).flexGrow).to.equal('0');
      expect(getComputedStyle(detail).flexShrink).to.equal('0');
    });

    it('should use size as flex-basis when both masterSize and detailSize are set', () => {
      layout.masterSize = '300px';
      layout.detailSize = '300px';
      expect(getComputedStyle(master).flexBasis).to.equal('300px');
      expect(getComputedStyle(master).flexGrow).to.equal('1');
      expect(getComputedStyle(detail).flexBasis).to.equal('300px');
      expect(getComputedStyle(detail).flexGrow).to.equal('1');
    });
  });
});
