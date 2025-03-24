import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

describe('vaadin-master-detail-layout', () => {
  let layout, master, detail, detailContent;

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

  describe('stack', () => {
    let width, height;

    before(() => {
      width = window.innerWidth;
      height = window.innerHeight;
    });

    afterEach(async () => {
      await setViewport({ width, height });
    });

    describe('default', () => {
      it('should switch from overlay to the stack mode when the stack threshold is set', async () => {
        // Use the threshold at which the overlay mode is on by default.
        await setViewport({ width: 350, height });
        await nextResize(layout);

        layout.stackThreshold = '400px';

        expect(layout.hasAttribute('overlay')).to.be.false;
        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
        expect(getComputedStyle(detail).inset).to.equal('0px');
      });

      it('should clear the stack mode when the layout size is bigger than stack threshold', async () => {
        layout.stackThreshold = '400px';
        await nextRender();

        await setViewport({ width: 350, height });
        await nextResize(layout);

        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.false;
      });

      it('should not switch to the stack mode when forceOverlay is set to true', async () => {
        layout.forceOverlay = true;
        layout.stackThreshold = '500px';
        await nextRender();

        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.false;
        expect(layout.hasAttribute('overlay')).to.be.true;
      });

      it('should not apply min-width to the detail area in the stack mode', async () => {
        layout.detailMinSize = '500px';
        layout.stackThreshold = '500px';
        await nextRender();

        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).width).to.equal('450px');
      });

      it('should not apply width to the detail area in the stack mode', async () => {
        layout.detailSize = '500px';
        layout.stackThreshold = '500px';
        await nextRender();

        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).width).to.equal('450px');
      });

      it('should update stack mode when adding and removing details', async () => {
        layout.stackThreshold = '500px';

        // Start without details
        detailContent.remove();
        await nextRender();

        // Shrink viewport
        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.false;

        // Add details
        layout.appendChild(detailContent);
        await nextRender();

        expect(layout.hasAttribute('stack')).to.be.true;

        // Remove details
        detailContent.remove();
        await nextRender();

        expect(layout.hasAttribute('stack')).to.be.false;
      });

      it('should focus detail content when adding details in the stack mode', async () => {
        layout.stackThreshold = '500px';

        // Start without details
        detailContent.remove();
        await nextRender();

        // Shrink viewport
        await setViewport({ width: 450, height });
        await nextResize(layout);

        // Add details
        layout.appendChild(detailContent);
        await nextRender();

        const input = detailContent.shadowRoot.querySelector('input');
        expect(detailContent.shadowRoot.activeElement).to.equal(input);
      });
    });

    describe('vertical orientation', () => {
      beforeEach(() => {
        layout.orientation = 'vertical';
        layout.style.maxHeight = '500px';
        layout.parentElement.style.height = '100%';
      });

      it('should switch from overlay to the stack mode when the stack threshold is set', async () => {
        // Use the threshold at which the overlay mode is on by default.
        await setViewport({ width: 500, height: 400 });
        await nextResize(layout);

        layout.stackThreshold = '400px';

        expect(layout.hasAttribute('overlay')).to.be.false;
        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
        expect(getComputedStyle(detail).inset).to.equal('0px');
      });

      it('should use fixed position in the stack mode when viewport containment is used', async () => {
        layout.containment = 'viewport';

        // Use the threshold at which the overlay mode is on by default.
        await setViewport({ width: 500, height: 400 });
        await nextResize(layout);

        layout.stackThreshold = '400px';

        expect(layout.hasAttribute('overlay')).to.be.false;
        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('fixed');
        expect(getComputedStyle(detail).inset).to.equal('0px');
      });

      it('should not apply min-height to the detail area in the stack mode', async () => {
        layout.detailMinSize = '500px';
        layout.stackThreshold = '500px';
        await nextRender();

        await setViewport({ width, height: 450 });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).height).to.equal('450px');
      });

      it('should not apply height to the detail area in the stack mode', async () => {
        layout.detailSize = '500px';
        layout.stackThreshold = '500px';
        await nextRender();

        await setViewport({ width, height: 450 });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).height).to.equal('450px');
      });
    });
  });
});
