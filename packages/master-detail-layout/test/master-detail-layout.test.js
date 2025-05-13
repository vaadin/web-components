import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('vaadin-master-detail-layout', () => {
  let layout, master, detail, detailContent;
  let width, height;

  before(() => {
    width = window.innerWidth;
    height = window.innerHeight;
  });

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
    detailContent = layout.querySelector('[slot="detail"]');
  });

  afterEach(async () => {
    await setViewport({ width, height });
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

    it('should show the detail part with the detail child if provided', () => {
      expect(getComputedStyle(detail).display).to.equal('block');
    });

    it('should hide the detail part after the detail child is removed', async () => {
      detailContent.remove();
      await nextRender();
      expect(getComputedStyle(detail).display).to.equal('none');
    });
  });

  describe('size properties', () => {
    describe('default', () => {
      it('should set flex-basis to 50% on the master and detail by default', () => {
        expect(getComputedStyle(master).flexBasis).to.equal('50%');
        expect(getComputedStyle(detail).flexBasis).to.equal('50%');
      });

      it('should set flex-grow to 1 on the master and detail by default', () => {
        expect(getComputedStyle(master).flexGrow).to.equal('1');
        expect(getComputedStyle(detail).flexGrow).to.equal('1');
      });

      it('should set fixed width on the master area when masterSize is set', () => {
        layout.masterSize = '300px';
        expect(getComputedStyle(master).width).to.equal('300px');
        expect(getComputedStyle(master).flexBasis).to.equal('auto');
        expect(getComputedStyle(master).flexGrow).to.equal('0');
        expect(getComputedStyle(master).flexShrink).to.equal('0');
      });

      it('should set fixed width on the detail area when detailSize is set', () => {
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

      it('should use masterMinSize as min-width and disable flex-shrink', () => {
        layout.masterMinSize = '300px';
        expect(getComputedStyle(master).minWidth).to.equal('300px');
        expect(getComputedStyle(master).flexShrink).to.equal('0');
      });

      it('should use detailMinSize as min-width and disable flex-shrink', () => {
        layout.detailMinSize = '300px';
        expect(getComputedStyle(detail).minWidth).to.equal('300px');
        expect(getComputedStyle(detail).flexShrink).to.equal('0');
      });

      it('should not overflow in split mode when masterSize is set', async () => {
        layout.masterSize = '500px';
        detail.remove();
        await nextResize(layout);

        // Resize so that size is bigger than layout size.
        await setViewport({ width: 480, height });
        await nextResize(layout);

        expect(layout.hasAttribute('drawer')).to.be.false;
        expect(layout.offsetWidth).to.equal(480);
        expect(master.offsetWidth).to.equal(layout.offsetWidth);
      });

      it('should not overflow in split mode when masterMinSize is set', async () => {
        layout.masterMinSize = '500px';
        detail.remove();
        await nextResize(layout);

        // Resize so that min size is bigger than layout size.
        await setViewport({ width: 480, height });
        await nextResize(layout);

        expect(layout.hasAttribute('drawer')).to.be.false;
        expect(layout.offsetWidth).to.equal(480);
        expect(master.offsetWidth).to.equal(layout.offsetWidth);
      });
    });

    describe('vertical', () => {
      beforeEach(() => {
        layout.orientation = 'vertical';
      });

      it('should set fixed height on the master area when masterSize is set', () => {
        layout.masterSize = '200px';
        expect(getComputedStyle(master).height).to.equal('200px');
        expect(getComputedStyle(master).flexBasis).to.equal('auto');
        expect(getComputedStyle(master).flexGrow).to.equal('0');
        expect(getComputedStyle(master).flexShrink).to.equal('0');
      });

      it('should set fixed height on the detail area when detailSize is set', () => {
        layout.detailSize = '200px';
        expect(getComputedStyle(detail).height).to.equal('200px');
        expect(getComputedStyle(detail).flexBasis).to.equal('auto');
        expect(getComputedStyle(detail).flexGrow).to.equal('0');
        expect(getComputedStyle(detail).flexShrink).to.equal('0');
      });

      it('should use masterMinSize as min-height and disable flex-shrink', () => {
        layout.masterMinSize = '200px';
        expect(getComputedStyle(master).minHeight).to.equal('200px');
        expect(getComputedStyle(master).flexShrink).to.equal('0');
      });

      it('should use detailMinSize as min-height and disable flex-shrink', () => {
        layout.detailMinSize = '200px';
        expect(getComputedStyle(detail).minHeight).to.equal('200px');
        expect(getComputedStyle(detail).flexShrink).to.equal('0');
      });
    });
  });
});
