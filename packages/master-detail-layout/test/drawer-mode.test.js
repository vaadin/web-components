import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('drawer mode', () => {
  let layout, master, detail, detailWrapper, detailContent;
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
    detailWrapper = detail.parentElement;
    detailContent = layout.querySelector('[slot="detail"]');
  });

  afterEach(async () => {
    await setViewport({ width, height });
  });

  describe('default', () => {
    it('should switch to the drawer mode when there is not enough space for both areas', async () => {
      // Use the threshold at which the drawer mode is on by default.
      await setViewport({ width: 350, height });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
    });

    it('should switch to the drawer mode if not enough space when masterSize is set', async () => {
      // Use the threshold at which the drawer mode isn't on by default,
      // but will be on after setting fixed size on the master area.
      await setViewport({ width: 400, height });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      layout.masterSize = '300px';
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
    });

    it('should switch to the drawer mode if not enough space when masterMinSize is set', async () => {
      // Use the threshold at which the drawer mode isn't on by default,
      // but will be on after setting fixed size on the master area.
      await setViewport({ width: 400, height });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      layout.masterMinSize = '300px';
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
    });

    it('should set detail area width in drawer mode when detailSize is set', async () => {
      // Use the threshold at which the drawer mode isn't on by default,
      // but will be on after setting fixed size on the detail area.
      await setViewport({ width: 500, height });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      layout.detailSize = '300px';
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
      expect(getComputedStyle(detail).width).to.equal('300px');
    });

    it('should set detail area width in drawer mode when detailMinSize is set', async () => {
      // Use the threshold at which the drawer mode isn't on by default,
      // but will be on after setting min size on the detail area.
      await setViewport({ width: 500, height });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      layout.detailMinSize = '300px';
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
      expect(getComputedStyle(detail).width).to.equal('300px');
    });

    it('should switch to the drawer mode when masterSize is set to 100%', async () => {
      layout.masterSize = '100%';
      await nextResize(layout);
      expect(layout.hasAttribute('drawer')).to.be.true;
    });

    it('should switch to the drawer mode when masterMinSize is set to 100%', async () => {
      layout.masterMinSize = '100%';
      await nextResize(layout);
      expect(layout.hasAttribute('drawer')).to.be.true;
    });

    it('should not overflow in the drawer mode when detailMinSize is set', async () => {
      layout.masterSize = '500px';
      layout.detailMinSize = '500px';

      await nextResize(layout);

      // Resize so that min size is bigger than layout size.
      await setViewport({ width: 480, height });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detail).width).to.equal(`${layout.offsetWidth}px`);
      expect(getComputedStyle(detail).maxWidth).to.equal('100%');
    });

    it('should not overflow in the drawer mode when masterMinSize is set', async () => {
      layout.masterMinSize = '500px';
      await nextResize(layout);

      // Resize so that min size is bigger than layout size.
      await setViewport({ width: 480, height });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(master).width).to.equal(`${layout.offsetWidth}px`);
      expect(getComputedStyle(detail).maxWidth).to.equal('100%');
    });

    it('should update drawer mode when adding and removing details', async () => {
      // Start without details
      detailContent.remove();
      await nextRender();

      // Shrink viewport
      layout.detailMinSize = '300px';
      await setViewport({ width: 500, height });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      // Add details
      layout.appendChild(detailContent);
      await nextRender();

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
      expect(getComputedStyle(detail).width).to.equal('300px');

      // Remove details
      detailContent.remove();
      await nextRender();

      expect(layout.hasAttribute('drawer')).to.be.false;
    });

    it('should enforce the drawer mode when forceOverlay is set to true', async () => {
      layout.forceOverlay = true;
      await nextRender();
      expect(layout.hasAttribute('drawer')).to.be.true;

      layout.forceOverlay = false;
      await nextRender();
      expect(layout.hasAttribute('drawer')).to.be.false;
    });

    it('should preserve the drawer mode with forceOverlay after removing details', async () => {
      layout.forceOverlay = true;
      await nextRender();

      detailContent.remove();
      await nextRender();

      expect(layout.hasAttribute('drawer')).to.be.true;

      layout.appendChild(detailContent);
      await nextRender();

      expect(layout.hasAttribute('drawer')).to.be.true;
    });

    it('should focus detail content when adding details in the drawer mode', async () => {
      // Start without details
      detailContent.remove();
      await nextRender();

      layout.forceOverlay = true;

      // Add details
      layout.appendChild(detailContent);
      await nextRender();

      const input = detailContent.shadowRoot.querySelector('input');
      expect(detailContent.shadowRoot.activeElement).to.equal(input);
    });
  });

  describe('vertical', () => {
    beforeEach(async () => {
      layout.orientation = 'vertical';
      layout.style.maxHeight = '500px';
      layout.parentElement.style.height = '100%';
      await nextResize(layout);
    });

    it('should switch to the drawer mode when there is not enough space for both areas', async () => {
      // Use the threshold at which the drawer mode is on by default.
      await setViewport({ width: 500, height: 400 });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
    });

    it('should set detail area height in drawer mode when detailSize is set', async () => {
      // Use the threshold at which the drawer mode isn't on by default,
      // but will be on after setting fixed size on the detail area.
      await setViewport({ width: 700, height: 600 });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      layout.detailSize = '250px';
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
      expect(getComputedStyle(detail).height).to.equal('250px');

      layout.detailSize = '';
      await nextResize(layout);
      expect(layout.hasAttribute('drawer')).to.be.false;
    });

    it('should set detail area height in drawer mode when detailMinSize is set', async () => {
      // Use the threshold at which the drawer mode isn't on by default,
      // but will be on after setting min size on the detail area.
      await setViewport({ width: 700, height: 600 });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      layout.detailMinSize = '250px';
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;
      expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
      expect(getComputedStyle(detail).height).to.equal('250px');

      layout.detailMinSize = '';
      await nextResize(layout);
      expect(layout.hasAttribute('drawer')).to.be.false;
    });

    it('should switch to the drawer mode when masterSize is set', async () => {
      // Use the threshold at which the drawer mode isn't on by default,
      // but will be on after setting fixed size on the master area.
      await setViewport({ width: 700, height: 600 });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      layout.masterSize = '450px';
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;

      layout.masterSize = '';
      await nextResize(layout);
      expect(layout.hasAttribute('drawer')).to.be.false;
    });

    it('should switch to the drawer mode when masterMinSize is set', async () => {
      // Use the threshold at which the drawer mode isn't on by default,
      // but will be on after setting min size on the master area.
      await setViewport({ width: 700, height: 600 });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      layout.masterMinSize = '450px';
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;

      layout.masterMinSize = '';
      await nextResize(layout);
      expect(layout.hasAttribute('drawer')).to.be.false;
    });

    it('should update switch to the drawer mode when both sizes are set with border', async () => {
      // Add border to the detail area in the drawer mode.
      fixtureSync(`
        <style>
          vaadin-master-detail-layout[drawer]::part(detail) {
            border-top: solid 1px #ccc;
          }
        </style>
      `);

      await setViewport({ width: 800, height: 490 });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;

      layout.masterSize = '250px';
      layout.detailMinSize = '250px';
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.true;

      await setViewport({ width: 800, height: 600 });
      await nextResize(layout);

      expect(layout.hasAttribute('drawer')).to.be.false;
    });
  });

  describe('containment', () => {
    before(() => {
      // Apply padding to body to test viewport containment.
      document.body.style.padding = '20px';
    });

    after(() => {
      document.body.style.padding = '';
    });

    describe('horizontal orientation', () => {
      beforeEach(async () => {
        // Use the threshold at which the drawer mode is on by default.
        await setViewport({ width: 350, height });
        await nextResize(layout);

        expect(layout.hasAttribute('drawer')).to.be.true;
      });

      it('should contain drawer to layout by default', () => {
        const layoutBounds = layout.getBoundingClientRect();
        const detailBounds = detail.getBoundingClientRect();

        expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
        expect(detailBounds.top).to.equal(layoutBounds.top);
        expect(detailBounds.bottom).to.equal(layoutBounds.bottom);
        expect(detailBounds.right).to.equal(layoutBounds.right);
      });

      it('should contain drawer to viewport when configured', async () => {
        layout.containment = 'viewport';
        await nextRender();

        const detailBounds = detail.getBoundingClientRect();
        const windowBounds = document.documentElement.getBoundingClientRect();

        expect(getComputedStyle(detailWrapper).position).to.equal('fixed');
        expect(detailBounds.top).to.equal(windowBounds.top);
        expect(detailBounds.bottom).to.equal(windowBounds.bottom);
        expect(detailBounds.right).to.equal(windowBounds.right);
      });
    });

    describe('vertical orientation', () => {
      beforeEach(async () => {
        layout.orientation = 'vertical';
        layout.style.maxHeight = '500px';
        layout.parentElement.style.height = '100%';

        // Use the threshold at which the drawer mode is on by default.
        await setViewport({ width: 500, height: 400 });
        await nextResize(layout);

        expect(layout.hasAttribute('drawer')).to.be.true;
      });

      it('should contain overlay to layout by default', () => {
        const layoutBounds = layout.getBoundingClientRect();
        const detailBounds = detail.getBoundingClientRect();

        expect(getComputedStyle(detailWrapper).position).to.equal('absolute');
        expect(detailBounds.left).to.equal(layoutBounds.left);
        expect(detailBounds.right).to.equal(layoutBounds.right);
        expect(detailBounds.bottom).to.equal(layoutBounds.bottom);
      });

      it('should contain overlay to viewport when configured', async () => {
        layout.containment = 'viewport';
        await nextRender();

        const detailBounds = detail.getBoundingClientRect();
        const windowBounds = document.documentElement.getBoundingClientRect();

        expect(getComputedStyle(detailWrapper).position).to.equal('fixed');
        expect(detailBounds.left).to.equal(windowBounds.left);
        expect(detailBounds.right).to.equal(windowBounds.right);
        expect(detailBounds.bottom).to.equal(windowBounds.bottom);
      });
    });
  });
});
