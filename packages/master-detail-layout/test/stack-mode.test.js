import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('stack mode', () => {
  let layout, master, detail, detailContent;

  let width, height;

  before(() => {
    width = window.innerWidth;
    height = window.innerHeight;
  });

  afterEach(async () => {
    await setViewport({ width, height });
  });

  describe('default', () => {
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

    describe('horizontal orientation', () => {
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

      it('should preserve the stack mode when adding and removing details', async () => {
        layout.stackThreshold = '500px';

        // Start without details
        detailContent.remove();
        await nextRender();

        // Shrink viewport
        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;

        // Add details
        layout.appendChild(detailContent);
        await nextRender();

        expect(layout.hasAttribute('stack')).to.be.true;

        // Remove details
        detailContent.remove();
        await nextRender();

        expect(layout.hasAttribute('stack')).to.be.true;
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

      it('should not overflow in stack mode when masterSize is set', async () => {
        layout.stackThreshold = '500px';
        layout.masterSize = '500px';
        await nextResize(layout);

        // Resize so that size is bigger than layout size.
        await setViewport({ width: 480, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(layout.offsetWidth).to.equal(480);
        expect(master.offsetWidth).to.equal(layout.offsetWidth);
      });

      it('should not overflow in stack mode when masterMinSize is set', async () => {
        layout.stackThreshold = '500px';
        layout.masterMinSize = '500px';
        await nextResize(layout);

        // Resize so that size is bigger than layout size.
        await setViewport({ width: 480, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(layout.offsetWidth).to.equal(480);
        expect(master.offsetWidth).to.equal(layout.offsetWidth);
      });

      it('should not overflow in stack mode when detailSize is set', async () => {
        layout.detailSize = '500px';
        layout.stackThreshold = '500px';
        await nextRender();

        // Resize so that min size is bigger than layout size
        await setViewport({ width: 480, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(layout.offsetWidth).to.equal(480);
        expect(detail.offsetWidth).to.equal(layout.offsetWidth);
      });

      it('should not overflow in stack mode when detailMinSize is set', async () => {
        layout.detailMinSize = '500px';
        layout.stackThreshold = '500px';
        await nextRender();

        // Resize so that min size is bigger than layout size
        await setViewport({ width: 480, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(layout.offsetWidth).to.equal(480);
        expect(detail.offsetWidth).to.equal(layout.offsetWidth);
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

  describe('nested', () => {
    let layout, nested;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="200px">
          <div>Master</div>
          <vaadin-master-detail-layout
            slot="detail"
            master-min-size="300px"
            detail-min-size="200px"
            stack-threshold="400px"
            containment="viewport"
          >
            <div>Nested master</div>
            <div slot="detail">Nested detail</div>
          </vaadin-master-detail-layout>
        </vaadin-master-detail-layout>
      `);
      await nextRender();
      nested = layout.querySelector('[slot="detail"]');
    });

    it('should switch to the stack mode when layout has master and detail min size', async () => {
      // Split mode
      await setViewport({ width: 800, height });
      await nextResize(nested);

      expect(nested.hasAttribute('overlay')).to.be.false;
      expect(nested.hasAttribute('stack')).to.be.false;

      // Stack mode
      await setViewport({ width: 550, height });
      await nextResize(nested);

      expect(nested.hasAttribute('stack')).to.be.true;
    });
  });
});
