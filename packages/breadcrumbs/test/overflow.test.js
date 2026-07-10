import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumbs.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('overflow', () => {
  let breadcrumbs, items, button, overlay;

  function expectOverlayItems(expectedIndexes) {
    items.forEach((item, index) => {
      const inOverlay = item.slot === 'overlay';
      const shouldBeInOverlay = expectedIndexes.includes(index);
      expect(inOverlay, `item ${index}`).to.equal(shouldBeInOverlay);
    });
  }

  function expectFocusedItem(item) {
    const link = item.shadowRoot.querySelector('[part="link"]');
    expect(getDeepActiveElement()).to.equal(link);
  }

  beforeEach(async () => {
    breadcrumbs = fixtureSync(`
      <vaadin-breadcrumbs>
        <vaadin-breadcrumbs-item style="width: 100px" path="/">Home</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item style="width: 100px" path="/docs">Documents</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item style="width: 100px" path="/docs/projects">Projects</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item style="width: 100px" path="/docs/projects/2026">2026</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item style="width: 100px" path="/docs/projects/2026/q1">Quarter Reports</vaadin-breadcrumbs-item>
        <vaadin-breadcrumbs-item style="width: 100px">Summary report</vaadin-breadcrumbs-item>
      </vaadin-breadcrumbs>
    `);
    await nextRender();
    await nextResize(breadcrumbs);
    items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
    button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
    overlay = breadcrumbs.shadowRoot.querySelector('vaadin-breadcrumbs-overlay');
  });

  describe('detection', () => {
    it('should collapse the closest-to-root item first', async () => {
      breadcrumbs.style.maxWidth = '600px';
      await nextResize(breadcrumbs);

      expectOverlayItems([1]);
    });

    it('should keep the root in the trail until last', async () => {
      breadcrumbs.style.maxWidth = '600px';
      await nextResize(breadcrumbs);

      expect(items[0].slot).to.equal('root');
    });

    it('should never collapse the last item', async () => {
      breadcrumbs.style.maxWidth = '20px';
      await nextResize(breadcrumbs);

      expect(items.at(-1).slot).to.not.equal('overlay');
    });

    it('should collapse more items as the container shrinks', async () => {
      breadcrumbs.style.maxWidth = '600px';
      await nextResize(breadcrumbs);
      expectOverlayItems([1]);

      breadcrumbs.style.maxWidth = '280px';
      await nextResize(breadcrumbs);
      expectOverlayItems([1, 2, 3, 4]);
    });

    it('should collapse the root when only the last item fits', async () => {
      breadcrumbs.style.maxWidth = '150px';
      await nextResize(breadcrumbs);

      expect(items[0].slot).to.equal('overlay');
    });

    it('should restore items when the container widens', async () => {
      breadcrumbs.style.maxWidth = '280px';
      await nextResize(breadcrumbs);

      breadcrumbs.style.maxWidth = '800px';
      await nextResize(breadcrumbs);

      expectOverlayItems([]);
    });

    it('should clear has-overflow when items fit again', async () => {
      breadcrumbs.style.maxWidth = '280px';
      await nextResize(breadcrumbs);

      breadcrumbs.style.maxWidth = '100%';
      await nextResize(breadcrumbs);

      expect(breadcrumbs.hasAttribute('has-overflow')).to.be.false;
    });

    it('should re-run detection when items are added', async () => {
      for (let i = 0; i < 6; i += 1) {
        const item = document.createElement('vaadin-breadcrumbs-item');
        item.path = `/extra/${i}`;
        item.textContent = `Extra long item label ${i}`;
        breadcrumbs.insertBefore(item, breadcrumbs.lastElementChild);
      }
      await nextRender();

      expect(breadcrumbs.hasAttribute('has-overflow')).to.be.true;
    });
  });

  describe('overlay', () => {
    it('should set overlay owner to the breadcrumbs element', () => {
      expect(overlay.owner).to.equal(breadcrumbs);
    });

    it('should set overlay positionTarget to the overflow button', () => {
      expect(overlay.positionTarget).to.equal(button);
    });
  });

  describe('opening', () => {
    beforeEach(async () => {
      breadcrumbs.style.maxWidth = '200px';
      await nextResize(breadcrumbs);
    });

    it('should toggle overlay opened on button click', async () => {
      button.click();
      await nextRender();

      expect(overlay.opened).to.be.true;

      button.click();
      await nextRender();

      expect(overlay.opened).to.be.false;
    });

    it('should update aria-expanded attribute on the overflow button', async () => {
      button.click();
      await nextRender();

      expect(button.getAttribute('aria-expanded')).to.equal('true');

      button.click();
      await nextRender();

      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should open the overlay when Enter is pressed', async () => {
      button.focus();
      await sendKeys({ press: 'Enter' });
      await nextRender();

      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay when Space is pressed', async () => {
      button.focus();
      await sendKeys({ press: 'Space' });
      await nextRender();

      expect(overlay.opened).to.be.true;
    });

    it('should keep focus on the overflow button after opening via click', async () => {
      button.focus();
      button.click();
      await nextRender();

      expect(breadcrumbs.shadowRoot.activeElement).to.equal(button);
    });

    it('should keep focus on the overflow button after opening via Enter', async () => {
      button.focus();
      await sendKeys({ press: 'Enter' });
      await nextRender();

      expect(breadcrumbs.shadowRoot.activeElement).to.equal(button);
    });

    it('should keep focus on the overflow button after opening via Space', async () => {
      button.focus();
      await sendKeys({ press: 'Space' });
      await nextRender();

      expect(breadcrumbs.shadowRoot.activeElement).to.equal(button);
    });
  });

  describe('closing', () => {
    beforeEach(async () => {
      breadcrumbs.style.maxWidth = '600px';
      await nextResize(breadcrumbs);

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should close the overlay on Escape key press', async () => {
      await sendKeys({ press: 'Escape' });
      await nextRender();

      expect(overlay.opened).to.be.false;
    });

    it('should close the overlay on Tab key press', async () => {
      await sendKeys({ press: 'Tab' });
      await nextRender();

      expect(overlay.opened).to.be.false;
    });

    it('should focus next trail item when closed on Tab', async () => {
      await sendKeys({ press: 'Tab' });
      await nextRender();

      expectFocusedItem(items[2]);
    });

    it('should focus previous trail item when closed on Shift+Tab', async () => {
      await sendKeys({ press: 'Shift+Tab' });
      await nextRender();

      expectFocusedItem(items[0]);
    });

    it('should return focus to the overflow button when closed via Escape', async () => {
      await sendKeys({ press: 'Escape' });
      await nextRender();

      expect(breadcrumbs.shadowRoot.activeElement).to.equal(button);
    });

    it('should close the overlay on outside click', async () => {
      document.body.click();
      await nextRender();

      expect(overlay.opened).to.be.false;
    });
  });

  describe('navigation', () => {
    let overlayItems;

    beforeEach(async () => {
      // Collapse all items to the overlay
      breadcrumbs.style.maxWidth = '200px';
      await nextResize(breadcrumbs);

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      overlayItems = items.filter((item) => item.slot === 'overlay');
    });

    it('should move focus to the first link on first ArrowDown', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      expectFocusedItem(overlayItems[0]);
    });

    it('should move focus to the last link on first ArrowUp', async () => {
      await sendKeys({ press: 'ArrowUp' });
      await nextRender();

      expectFocusedItem(overlayItems.at(-1));
    });

    it('should move focus to the next link on subsequent ArrowDown', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      expectFocusedItem(overlayItems[1]);
    });

    it('should move focus to the previous link on subsequent ArrowUp', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      await sendKeys({ press: 'ArrowUp' });
      await nextRender();

      expectFocusedItem(overlayItems[0]);
    });

    it('should focus the first link on ArrowDown when the last one is focused', async () => {
      // First ArrowDown lands on the first item; subsequent ArrowDowns step to the last.
      for (const item of overlayItems) {
        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expectFocusedItem(item);
      }

      expectFocusedItem(overlayItems.at(-1));

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      expectFocusedItem(overlayItems[0]);
    });

    it('should focus the last link on End', async () => {
      await sendKeys({ press: 'End' });
      await nextRender();

      expectFocusedItem(overlayItems.at(-1));
    });

    it('should focus the first link on Home', async () => {
      await sendKeys({ press: 'End' });
      await nextRender();

      await sendKeys({ press: 'Home' });
      await nextRender();

      expectFocusedItem(overlayItems[0]);
    });
  });

  describe('disabled items', () => {
    beforeEach(async () => {
      // Collapse all items to the overlay
      breadcrumbs.style.maxWidth = '200px';
      await nextResize(breadcrumbs);
    });

    it('should skip the first disabled item on first ArrowDown', async () => {
      items[0].disabled = true;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      expectFocusedItem(items[1]);
    });

    it('should skip the last disabled item on first ArrowUp', async () => {
      items[4].disabled = true;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'ArrowUp' });
      await nextRender();

      expectFocusedItem(items[3]);
    });

    it('should skip a disabled item on subsequent ArrowDown', async () => {
      items[1].disabled = true;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      expectFocusedItem(items[2]);
    });

    it('should skip a disabled item on subsequent ArrowUp', async () => {
      items[3].disabled = true;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'End' });
      await nextRender();

      await sendKeys({ press: 'ArrowUp' });
      await nextRender();

      expectFocusedItem(items[2]);
    });

    it('should focus the previous focusable item on End when last is disabled', async () => {
      items[4].disabled = true;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'End' });
      await nextRender();

      expectFocusedItem(items[3]);
    });

    it('should focus the next focusable item on Home when first is disabled', async () => {
      items[0].disabled = true;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'End' });
      await nextRender();

      await sendKeys({ press: 'Home' });
      await nextRender();

      expectFocusedItem(items[1]);
    });
  });

  describe('non-link items', () => {
    beforeEach(async () => {
      // Collapse all items to the overlay
      breadcrumbs.style.maxWidth = '200px';
      await nextResize(breadcrumbs);
    });

    it('should skip the first item without path on first ArrowDown', async () => {
      items[0].path = null;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      expectFocusedItem(items[1]);
    });

    it('should skip the last item without path on first ArrowUp', async () => {
      items[4].path = null;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'ArrowUp' });
      await nextRender();

      expectFocusedItem(items[3]);
    });

    it('should skip item without path on subsequent ArrowDown', async () => {
      items[1].path = null;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      expectFocusedItem(items[2]);
    });

    it('should skip item without path on subsequent ArrowUp', async () => {
      items[3].path = null;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'End' });
      await nextRender();

      await sendKeys({ press: 'ArrowUp' });
      await nextRender();

      expectFocusedItem(items[2]);
    });

    it('should focus the previous focusable item on End when last has no path', async () => {
      items[4].path = null;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'End' });
      await nextRender();

      expectFocusedItem(items[3]);
    });

    it('should focus the next focusable item on Home when first has no path', async () => {
      items[0].path = null;

      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'End' });
      await nextRender();

      await sendKeys({ press: 'Home' });
      await nextRender();

      expectFocusedItem(items[1]);
    });
  });

  describe('font-size', () => {
    beforeEach(async () => {
      breadcrumbs.style.setProperty('--vaadin-breadcrumbs-font-size', '12px');

      // Collapse all items to the overlay
      breadcrumbs.style.maxWidth = '200px';
      await nextResize(breadcrumbs);

      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should apply --vaadin-breadcrumbs-font-size to overlay items', () => {
      const overlayItems = items.filter((item) => item.slot === 'overlay');
      expect(overlayItems).to.not.be.empty;
      overlayItems.forEach((item) => {
        expect(getComputedStyle(item).fontSize).to.equal('12px');
      });
    });
  });

  describe('focus()', () => {
    it('should focus the overflow button when the root item is disabled', async () => {
      breadcrumbs.style.maxWidth = '600px';
      await nextResize(breadcrumbs);
      items[0].disabled = true;

      breadcrumbs.focus();

      expect(breadcrumbs.shadowRoot.activeElement).to.equal(button);
    });

    it('should focus the overflow button when the root item is collapsed', async () => {
      breadcrumbs.style.maxWidth = '200px';
      await nextResize(breadcrumbs);

      breadcrumbs.focus();

      expect(breadcrumbs.shadowRoot.activeElement).to.equal(button);
    });
  });
});
