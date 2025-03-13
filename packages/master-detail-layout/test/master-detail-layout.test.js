import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
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

    it('should show the detail part with the detail child if provided', () => {
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
  });

  describe('overlay', () => {
    let width, height;

    before(() => {
      width = window.innerWidth;
      height = window.innerHeight;
    });

    afterEach(async () => {
      await setViewport({ width, height });
    });

    it('should switch to the overlay when there is not enough space for both panes', async () => {
      // Use the threshold at which the overlay mode is on by default.
      await setViewport({ width: 350, height });
      await nextResize(layout);

      expect(layout.hasAttribute('overlay')).to.be.true;
      expect(getComputedStyle(detail).position).to.equal('absolute');
    });

    it('should set detail pane width in overlay mode when detailSize is set', async () => {
      // Use the threshold at which the overlay mode isn't on by default,
      // but will be on after setting fixed size on the detail pane.
      await setViewport({ width: 500, height });
      await nextResize(layout);

      expect(layout.hasAttribute('overlay')).to.be.false;

      layout.detailSize = '300px';
      await nextResize(layout);

      expect(layout.hasAttribute('overlay')).to.be.true;
      expect(getComputedStyle(detail).position).to.equal('absolute');
      expect(getComputedStyle(detail).width).to.equal('300px');
    });

    it('should set detail pane width in overlay mode when detailMinSize is set', async () => {
      // Use the threshold at which the overlay mode isn't on by default,
      // but will be on after setting min size on the detail pane.
      await setViewport({ width: 500, height });
      await nextResize(layout);

      expect(layout.hasAttribute('overlay')).to.be.false;

      layout.detailMinSize = '300px';
      await nextResize(layout);

      expect(layout.hasAttribute('overlay')).to.be.true;
      expect(getComputedStyle(detail).position).to.equal('absolute');
      expect(getComputedStyle(detail).width).to.equal('300px');
    });

    it('should switch to the overlay mode when masterSize is set to 100%', async () => {
      layout.masterSize = '100%';
      await nextResize(layout);
      expect(layout.hasAttribute('overlay')).to.be.true;
    });

    it('should switch to the overlay mode when masterMinSize is set to 100%', async () => {
      layout.masterMinSize = '100%';
      await nextResize(layout);
      expect(layout.hasAttribute('overlay')).to.be.true;
    });
  });
});
