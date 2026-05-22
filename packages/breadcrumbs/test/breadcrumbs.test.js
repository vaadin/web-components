import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumbs.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs', () => {
  let breadcrumbs;

  beforeEach(() => {
    breadcrumbs = fixtureSync('<vaadin-breadcrumbs></vaadin-breadcrumbs>');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = breadcrumbs.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('role', () => {
    describe('default', () => {
      beforeEach(async () => {
        breadcrumbs = fixtureSync('<vaadin-breadcrumbs></vaadin-breadcrumbs>');
        await nextRender();
      });

      it('should set role attribute to navigation by default', () => {
        expect(breadcrumbs.getAttribute('role')).to.equal('navigation');
      });
    });

    describe('custom', () => {
      beforeEach(async () => {
        breadcrumbs = fixtureSync('<vaadin-breadcrumbs role="presentation"></vaadin-breadcrumbs>');
        await nextRender();
      });

      it('should not override custom role', () => {
        expect(breadcrumbs.getAttribute('role')).to.equal('presentation');
      });
    });
  });

  describe('current', () => {
    let items;

    beforeEach(async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
      items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
    });

    it('should clear current on the last item when its path is set', async () => {
      items[2].setAttribute('path', '/now-linked');
      await nextRender();
      expect(items[2].hasAttribute('current')).to.be.false;
    });

    it('should set current on the last item when its path is removed', async () => {
      items[2].setAttribute('path', '/api');
      await nextRender();

      items[2].removeAttribute('path');
      await nextRender();

      expect(items[2].hasAttribute('current')).to.be.true;
    });

    it('should re-evaluate current when a new item is added', async () => {
      const item = document.createElement('vaadin-breadcrumbs-item');
      item.textContent = 'New item';
      breadcrumbs.appendChild(item);
      await nextRender();

      expect(items[2].hasAttribute('current')).to.be.false;
      expect(item.hasAttribute('current')).to.be.true;
    });

    it('should re-evaluate current when the last item is removed', async () => {
      items[2].remove();
      await nextRender();

      expect(items[1].hasAttribute('current')).to.be.false;
    });
  });

  describe('separator', () => {
    let items;

    beforeEach(async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs/api">API</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
      items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
    });

    it('should render a visible ::after separator on items that are not last', () => {
      expect(getComputedStyle(items[0], '::after').display).to.not.equal('none');
      expect(getComputedStyle(items[1], '::after').display).to.not.equal('none');
    });

    it('should hide the ::after separator on the last item', () => {
      expect(getComputedStyle(items[2], '::after').display).to.equal('none');
    });

    it('should hide the ::after separator on an item with current attribute', async () => {
      items[0]._setCurrent(true);
      await nextRender();

      expect(getComputedStyle(items[0], '::after').display).to.equal('none');
    });
  });

  describe('root slot', () => {
    beforeEach(async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
    });

    it('should move slot="root" when a new first item is prepended', async () => {
      const newItem = document.createElement('vaadin-breadcrumbs-item');
      newItem.path = '/new';
      newItem.textContent = 'New root';
      breadcrumbs.insertBefore(newItem, breadcrumbs.firstElementChild);
      await nextRender();

      const items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      expect(items[0]).to.equal(newItem);
      expect(items[0].getAttribute('slot')).to.equal('root');
      expect(items[1].hasAttribute('slot')).to.be.false;
    });

    it('should move slot="root" to the next item when the first item is removed', async () => {
      const items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      items[0].remove();
      await nextRender();

      const remaining = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      expect(remaining[0].getAttribute('slot')).to.equal('root');
    });
  });

  describe('overflow', () => {
    let items, button, overlay;

    function expectOverlayItems(expectedIndexes) {
      items.forEach((item, index) => {
        const inOverlay = item.slot === 'overlay';
        const shouldBeInOverlay = expectedIndexes.includes(index);
        expect(inOverlay, `item ${index}`).to.equal(shouldBeInOverlay);
      });
    }

    beforeEach(async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs style="max-width: 800px;">
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs">Documents</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs/projects">Projects</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs/projects/2026">2026</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs/projects/2026/q1">Quarter Reports</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item>Summary report</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
      items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      // Pin each item to a fixed width so collapse thresholds in the
      // tests below are not sensitive to font metric differences
      // between local macOS and CI Linux.
      items.forEach((item) => {
        item.style.width = '100px';
      });
      await nextResize(breadcrumbs);
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

        breadcrumbs.style.maxWidth = '800px';
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

      it('should move focus to the first overlay item after opening via Enter', async () => {
        button.focus();
        await sendKeys({ press: 'Enter' });
        await nextRender();

        const firstItem = breadcrumbs.querySelector('vaadin-breadcrumbs-item[slot="overlay"]');
        const firstLink = firstItem.shadowRoot.querySelector('[part="link"]');
        expect(getDeepActiveElement()).to.equal(firstLink);
      });

      it('should move focus to the first overlay item after opening via Space', async () => {
        button.focus();
        await sendKeys({ press: 'Space' });
        await nextRender();

        const firstItem = breadcrumbs.querySelector('vaadin-breadcrumbs-item[slot="overlay"]');
        const firstLink = firstItem.shadowRoot.querySelector('[part="link"]');
        expect(getDeepActiveElement()).to.equal(firstLink);
      });
    });

    describe('closing', () => {
      beforeEach(async () => {
        breadcrumbs.style.maxWidth = '600px';
        await nextResize(breadcrumbs);

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

        const nextLink = items[2].shadowRoot.querySelector('[part="link"]');
        expect(getDeepActiveElement()).to.equal(nextLink);
      });

      it('should focus previous trail item when closed on Shift+Tab', async () => {
        await sendKeys({ press: 'Shift+Tab' });
        await nextRender();

        const prevLink = items[0].shadowRoot.querySelector('[part="link"]');
        expect(getDeepActiveElement()).to.equal(prevLink);
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
  });
});
