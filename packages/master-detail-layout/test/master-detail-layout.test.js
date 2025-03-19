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

  describe('overlay', () => {
    let width, height;

    before(() => {
      width = window.innerWidth;
      height = window.innerHeight;
    });

    afterEach(async () => {
      await setViewport({ width, height });
    });

    describe('default', () => {
      it('should switch to the overlay when there is not enough space for both areas', async () => {
        // Use the threshold at which the overlay mode is on by default.
        await setViewport({ width: 350, height });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
      });

      it('should switch to the overlay mode if not enough space when masterSize is set', async () => {
        // Use the threshold at which the overlay mode isn't on by default,
        // but will be on after setting fixed size on the master area.
        await setViewport({ width: 400, height });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.masterSize = '300px';
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
      });

      it('should switch to the overlay mode if not enough space when masterMinSize is set', async () => {
        // Use the threshold at which the overlay mode isn't on by default,
        // but will be on after setting fixed size on the master area.
        await setViewport({ width: 400, height });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.masterMinSize = '300px';
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
      });

      it('should set detail area width in overlay mode when detailSize is set', async () => {
        // Use the threshold at which the overlay mode isn't on by default,
        // but will be on after setting fixed size on the detail area.
        await setViewport({ width: 500, height });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.detailSize = '300px';
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
        expect(getComputedStyle(detail).width).to.equal('300px');
      });

      it('should set detail area width in overlay mode when detailMinSize is set', async () => {
        // Use the threshold at which the overlay mode isn't on by default,
        // but will be on after setting min size on the detail area.
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

      it('should not overflow in the overlay mode when detailMinSize is set', async () => {
        layout.masterSize = '500px';
        layout.detailMinSize = '500px';

        await nextResize(layout);

        // Resize so that min size is bigger than layout size.
        await setViewport({ width: 480, height });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(detail).width).to.equal(`${layout.offsetWidth}px`);
        expect(getComputedStyle(detail).maxWidth).to.equal('100%');
      });

      it('should not overflow in the overlay mode when masterMinSize is set', async () => {
        layout.masterMinSize = '500px';
        await nextResize(layout);

        // Resize so that min size is bigger than layout size.
        await setViewport({ width: 480, height });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(master).width).to.equal(`${layout.offsetWidth}px`);
        expect(getComputedStyle(detail).maxWidth).to.equal('100%');
      });

      it('should update overlay mode when adding and removing details', async () => {
        // Start without details
        detailContent.remove();
        await nextRender();

        // Shrink viewport
        layout.detailMinSize = '300px';
        await setViewport({ width: 500, height });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;

        // Add details
        layout.appendChild(detailContent);
        await nextRender();

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
        expect(getComputedStyle(detail).width).to.equal('300px');

        // Remove details
        detailContent.remove();
        await nextRender();

        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should enforce the overlay mode when forceOverlay is set to true', async () => {
        layout.forceOverlay = true;
        await nextRender();
        expect(layout.hasAttribute('overlay')).to.be.true;

        layout.forceOverlay = false;
        await nextRender();
        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should not set the overlay mode with forceOverlay after removing details', async () => {
        layout.forceOverlay = true;
        await nextRender();

        detailContent.remove();
        await nextRender();

        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.appendChild(detailContent);
        await nextRender();

        expect(layout.hasAttribute('overlay')).to.be.true;
      });
    });

    describe('vertical', () => {
      beforeEach(async () => {
        layout.orientation = 'vertical';
        layout.style.maxHeight = '500px';
        layout.parentElement.style.height = '100%';
        await nextResize(layout);
      });

      it('should switch to the overlay when there is not enough space for both areas', async () => {
        // Use the threshold at which the overlay mode is on by default.
        await setViewport({ width: 500, height: 400 });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
      });

      it('should set detail area height in overlay mode when detailSize is set', async () => {
        // Use the threshold at which the overlay mode isn't on by default,
        // but will be on after setting fixed size on the detail area.
        await setViewport({ width: 700, height: 600 });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.detailSize = '250px';
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
        expect(getComputedStyle(detail).height).to.equal('250px');

        layout.detailSize = '';
        await nextResize(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should set detail area height in overlay mode when detailMinSize is set', async () => {
        // Use the threshold at which the overlay mode isn't on by default,
        // but will be on after setting min size on the detail area.
        await setViewport({ width: 700, height: 600 });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.detailMinSize = '250px';
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
        expect(getComputedStyle(detail).height).to.equal('250px');

        layout.detailMinSize = '';
        await nextResize(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should switch to the overlay mode when masterSize is set', async () => {
        // Use the threshold at which the overlay mode isn't on by default,
        // but will be on after setting fixed size on the master area.
        await setViewport({ width: 700, height: 600 });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.masterSize = '450px';
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;

        layout.masterSize = '';
        await nextResize(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should switch to the overlay mode when masterMinSize is set', async () => {
        // Use the threshold at which the overlay mode isn't on by default,
        // but will be on after setting min size on the master area.
        await setViewport({ width: 700, height: 600 });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.masterMinSize = '450px';
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;

        layout.masterMinSize = '';
        await nextResize(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should update switch to the overlay mode when both sizes are set with border', async () => {
        // Add border to the detail area in the overlay mode.
        fixtureSync(`
          <style>
            vaadin-master-detail-layout[overlay]::part(detail) {
              border-top: solid 1px #ccc;
            }
          </style>
        `);

        await setViewport({ width: 800, height: 490 });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.masterSize = '250px';
        layout.detailMinSize = '250px';
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.true;

        await setViewport({ width: 800, height: 600 });
        await nextResize(layout);

        expect(layout.hasAttribute('overlay')).to.be.false;
      });
    });
  });
});
