import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('stack mode', () => {
  let layout, master, detail, detailWrapper, detailContent;

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
      detailWrapper = detail.parentElement;
      detailContent = layout.querySelector('[slot="detail"]');
    });

    describe('horizontal orientation', () => {
      it('should switch from drawer to the stack mode when the stackOverlay is set', async () => {
        // Use the threshold at which the drawer mode is on by default.
        await setViewport({ width: 350, height });
        await nextResize(layout);

        layout.stackOverlay = true;

        expect(layout.hasAttribute('drawer')).to.be.false;
        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
        expect(getComputedStyle(detailWrapper).inset).to.equal('0px');
      });

      it('should clear the stack mode when there is enough space for both areas to fit', async () => {
        layout.stackOverlay = true;
        await nextRender();

        await setViewport({ width: 350, height });
        await nextResize(layout);

        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.false;
      });

      it('should switch to the stack mode when forceOverlay is set to true', async () => {
        layout.forceOverlay = true;
        layout.stackOverlay = true;
        await nextRender();

        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(layout.hasAttribute('drawer')).to.be.false;
      });

      it('should not apply min-width to the detail area in the stack mode', async () => {
        layout.detailMinSize = '500px';
        layout.stackOverlay = true;
        await nextRender();

        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).width).to.equal('450px');
      });

      it('should not apply width to the detail area in the stack mode', async () => {
        layout.detailSize = '500px';
        layout.stackOverlay = true;
        await nextRender();

        await setViewport({ width: 450, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).width).to.equal('450px');
      });

      it('should update stack mode when adding and removing details', async () => {
        layout.stackOverlay = true;

        // Start without details
        detailContent.remove();
        await nextRender();

        // Shrink viewport
        layout.detailMinSize = '300px';
        await setViewport({ width: 500, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.false;

        // Add details
        layout.appendChild(detailContent);
        await nextRender();

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detailWrapper).position).to.equal('absolute');

        // Remove details
        detailContent.remove();
        await nextRender();

        expect(layout.hasAttribute('stack')).to.be.false;
      });

      it('should focus detail content when adding details in the stack mode', async () => {
        layout.stackOverlay = true;

        // Start without details
        detailContent.remove();
        await nextRender();

        // Shrink viewport
        await setViewport({ width: 350, height });
        await nextResize(layout);

        // Add details
        layout.appendChild(detailContent);
        await nextRender();

        const input = detailContent.shadowRoot.querySelector('input');
        expect(detailContent.shadowRoot.activeElement).to.equal(input);
      });

      it('should not overflow in stack mode when masterSize is set', async () => {
        layout.stackOverlay = true;
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
        layout.stackOverlay = true;
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
        layout.stackOverlay = true;
        layout.detailSize = '500px';
        await nextRender();

        // Resize so that min size is bigger than layout size
        await setViewport({ width: 480, height });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(layout.offsetWidth).to.equal(480);
        expect(detail.offsetWidth).to.equal(layout.offsetWidth);
      });

      it('should not overflow in stack mode when detailMinSize is set', async () => {
        layout.stackOverlay = true;
        layout.detailMinSize = '500px';
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

      it('should switch from drawer to the stack mode when the stackOverlay is set', async () => {
        // Use the threshold at which the drawer mode is on by default.
        await setViewport({ width: 500, height: 400 });
        await nextResize(layout);

        layout.stackOverlay = true;

        expect(layout.hasAttribute('drawer')).to.be.false;
        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
        expect(getComputedStyle(detailWrapper).inset).to.equal('0px');
      });

      it('should use fixed position in the stack mode when viewport containment is used', async () => {
        layout.containment = 'viewport';

        // Use the threshold at which the drawer mode is on by default.
        await setViewport({ width: 500, height: 400 });
        await nextResize(layout);

        layout.stackOverlay = true;

        expect(layout.hasAttribute('drawer')).to.be.false;
        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detailWrapper).position).to.equal('fixed');
        expect(getComputedStyle(detailWrapper).inset).to.equal('0px');
      });

      it('should not apply min-height to the detail area in the stack mode', async () => {
        layout.stackOverlay = true;
        layout.detailMinSize = '500px';
        await nextRender();

        await setViewport({ width, height: 450 });
        await nextResize(layout);

        expect(layout.hasAttribute('stack')).to.be.true;
        expect(getComputedStyle(detail).height).to.equal('450px');
      });

      it('should not apply height to the detail area in the stack mode', async () => {
        layout.stackOverlay = true;
        layout.detailSize = '500px';
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
            stack-overlay
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

      expect(nested.hasAttribute('drawer')).to.be.false;
      expect(nested.hasAttribute('stack')).to.be.false;

      // Stack mode
      await setViewport({ width: 550, height });
      await nextResize(nested);

      expect(nested.hasAttribute('stack')).to.be.true;
    });
  });
});
