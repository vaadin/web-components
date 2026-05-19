import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumbs.js';

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

  describe('root slot assignment', () => {
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

    it('should assign slot="root" to the first item', () => {
      const items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      expect(items[0].getAttribute('slot')).to.equal('root');
    });

    it('should not assign slot to non-first items', () => {
      const items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      expect(items[1].hasAttribute('slot')).to.be.false;
      expect(items[2].hasAttribute('slot')).to.be.false;
    });

    it('should move slot="root" when a new first item is prepended', async () => {
      const newRoot = document.createElement('vaadin-breadcrumbs-item');
      newRoot.path = '/new';
      newRoot.textContent = 'New root';
      breadcrumbs.insertBefore(newRoot, breadcrumbs.firstElementChild);
      await nextRender();

      const items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      expect(items[0]).to.equal(newRoot);
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

  describe('i18n', () => {
    beforeEach(async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
    });

    it('should default i18n.moreItems to "More items"', () => {
      expect(breadcrumbs.i18n).to.be.an('object');
      expect(breadcrumbs.i18n.moreItems).to.equal('More items');
    });
  });

  describe('overflow detection', () => {
    let wrapper, items;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 800px;">
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs">Documents</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs/projects">Projects</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs/projects/2026">2026</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs/projects/2026/q1">Quarter Reports</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Summary report</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        </div>
      `);
      breadcrumbs = wrapper.querySelector('vaadin-breadcrumbs');
      await nextRender();
      items = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
    });

    it('should not set has-overflow when all items fit', () => {
      expect(breadcrumbs.hasAttribute('has-overflow')).to.be.false;
    });

    it('should not set data-overflow-hidden on any item when all items fit', () => {
      items.forEach((item) => {
        expect(item.hasAttribute('data-overflow-hidden')).to.be.false;
      });
    });

    it('should keep [part="overflow"] hidden when all items fit', () => {
      const overflow = breadcrumbs.shadowRoot.querySelector('[part="overflow"]');
      expect(overflow.hasAttribute('hidden')).to.be.true;
    });

    it('should set has-overflow when items no longer fit', async () => {
      wrapper.style.width = '300px';
      await nextResize(breadcrumbs);

      expect(breadcrumbs.hasAttribute('has-overflow')).to.be.true;
    });

    it('should unset hidden on [part="overflow"] when items no longer fit', async () => {
      wrapper.style.width = '300px';
      await nextResize(breadcrumbs);

      const overflow = breadcrumbs.shadowRoot.querySelector('[part="overflow"]');
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should set data-overflow-hidden on the first default-slot item first (not on root)', async () => {
      wrapper.style.width = '500px';
      await nextResize(breadcrumbs);

      // Items are: [root, default0, default1, default2, default3, last]
      expect(items[0].hasAttribute('data-overflow-hidden')).to.be.false;
      expect(items[1].hasAttribute('data-overflow-hidden')).to.be.true;
      expect(items[items.length - 1].hasAttribute('data-overflow-hidden')).to.be.false;
    });

    it('should hide additional default-slot items closest-to-root first as container shrinks', async () => {
      wrapper.style.width = '500px';
      await nextResize(breadcrumbs);
      const hiddenAfterFirstShrink = items.filter((item) => item.hasAttribute('data-overflow-hidden')).length;

      wrapper.style.width = '250px';
      await nextResize(breadcrumbs);
      const hiddenAfterSecondShrink = items.filter((item) => item.hasAttribute('data-overflow-hidden')).length;

      expect(hiddenAfterSecondShrink).to.be.greaterThan(hiddenAfterFirstShrink);

      // Verify closest-to-root first ordering: if item N is hidden, item N-1 (closer to root) must also be hidden,
      // for indices in the default-slot range (1..length-2).
      for (let i = 2; i < items.length - 1; i += 1) {
        if (items[i].hasAttribute('data-overflow-hidden')) {
          expect(items[i - 1].hasAttribute('data-overflow-hidden')).to.be.true;
        }
      }
    });

    it('should hide the root item when only the current item still fits', async () => {
      wrapper.style.width = '80px';
      await nextResize(breadcrumbs);

      expect(items[0].hasAttribute('data-overflow-hidden')).to.be.true;
    });

    it('should never set data-overflow-hidden on the last item regardless of width', async () => {
      wrapper.style.width = '20px';
      await nextResize(breadcrumbs);

      expect(items[items.length - 1].hasAttribute('data-overflow-hidden')).to.be.false;
    });

    it('should restore items in reverse order when the container widens again', async () => {
      wrapper.style.width = '250px';
      await nextResize(breadcrumbs);

      wrapper.style.width = '800px';
      await nextResize(breadcrumbs);

      items.forEach((item) => {
        expect(item.hasAttribute('data-overflow-hidden')).to.be.false;
      });
      expect(breadcrumbs.hasAttribute('has-overflow')).to.be.false;
    });

    it('should re-run detection when an item is added to a fitting trail', async () => {
      // Pre-condition: trail fits.
      expect(breadcrumbs.hasAttribute('has-overflow')).to.be.false;

      // Add many wide items so detection has to collapse some.
      for (let i = 0; i < 6; i += 1) {
        const item = document.createElement('vaadin-breadcrumbs-item');
        item.path = `/extra/${i}`;
        item.textContent = `Extra long item label ${i}`;
        breadcrumbs.insertBefore(item, breadcrumbs.lastElementChild);
      }
      wrapper.style.width = '300px';
      await nextResize(breadcrumbs);

      expect(breadcrumbs.hasAttribute('has-overflow')).to.be.true;
    });
  });

  describe('overflow separator', () => {
    let wrapper;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 300px;">
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a">A really wide label A</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a/b">Another wide label B</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a/b/c">Yet another wide label C</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Current page</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        </div>
      `);
      breadcrumbs = wrapper.querySelector('vaadin-breadcrumbs');
      await nextRender();
      await nextResize(breadcrumbs);
    });

    it('should render a visible ::after separator on [part="overflow"] when has-overflow is set', () => {
      const overflow = breadcrumbs.shadowRoot.querySelector('[part="overflow"]');
      expect(breadcrumbs.hasAttribute('has-overflow')).to.be.true;
      expect(getComputedStyle(overflow, '::after').display).to.not.equal('none');
    });

    it('should use mask-image on the overflow ::after separator', () => {
      const overflow = breadcrumbs.shadowRoot.querySelector('[part="overflow"]');
      const mask = getComputedStyle(overflow, '::after').maskImage;
      expect(mask).to.not.equal('none');
      expect(mask).to.be.a('string');
    });

    it('should flip the overflow ::after separator in RTL', async () => {
      document.documentElement.setAttribute('dir', 'rtl');
      await nextRender();

      const overflow = breadcrumbs.shadowRoot.querySelector('[part="overflow"]');
      const transform = getComputedStyle(overflow, '::after').transform;
      // matrix(-1, 0, 0, 1, 0, 0) corresponds to scaleX(-1)
      expect(transform).to.contain('matrix(-1');

      document.documentElement.removeAttribute('dir');
    });
  });

  describe('overflow button interaction', () => {
    let wrapper, button, overlay;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 200px;">
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a">Sub area A</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a/b">Sub area B</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a/b/c">Sub area C</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Current page</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        </div>
      `);
      breadcrumbs = wrapper.querySelector('vaadin-breadcrumbs');
      await nextRender();
      await nextResize(breadcrumbs);

      button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      overlay = breadcrumbs.shadowRoot.querySelector('vaadin-breadcrumbs-overlay');
    });

    it('should open the overlay when the overflow button is clicked', async () => {
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(overlay.opened).to.be.true;
    });

    it('should reflect opened state to aria-expanded on the overflow button', async () => {
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(button.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should close the overlay on subsequent overflow button click', async () => {
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      button.click();
      await nextRender();

      expect(overlay.opened).to.be.false;
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should close the overlay on Escape key press', async () => {
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'Escape' });
      await nextRender();

      expect(overlay.opened).to.be.false;
    });

    it('should return focus to the overflow button when overlay is closed via Escape', async () => {
      button.focus();
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      await sendKeys({ press: 'Escape' });
      await nextRender();

      expect(breadcrumbs.shadowRoot.activeElement).to.equal(button);
    });

    it('should close the overlay on outside click', async () => {
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      document.body.click();
      await nextRender();

      expect(overlay.opened).to.be.false;
    });

    it('should open the overlay when Enter is pressed on the focused overflow button', async () => {
      button.focus();
      await sendKeys({ press: 'Enter' });
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay when Space is pressed on the focused overflow button', async () => {
      button.focus();
      await sendKeys({ press: 'Space' });
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(overlay.opened).to.be.true;
    });

    it('should move focus to the first link in the overlay after opening via Enter', async () => {
      button.focus();
      await sendKeys({ press: 'Enter' });
      await oneEvent(overlay, 'vaadin-overlay-open');
      await nextRender();

      const slottedItems = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]')];
      expect(slottedItems.length).to.be.greaterThan(0);
      const firstLink = slottedItems[0].shadowRoot.querySelector('[part="link"]');
      expect(firstLink).to.be.ok;

      // Focus is delegated through the breadcrumbs-item host (delegatesFocus: true).
      const active = document.activeElement;
      expect(active === slottedItems[0] || slottedItems[0].contains(active) || active === firstLink).to.be.true;
    });

    it('should move focus to the first link in the overlay after opening via Space', async () => {
      button.focus();
      await sendKeys({ press: 'Space' });
      await oneEvent(overlay, 'vaadin-overlay-open');
      await nextRender();

      const slottedItems = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]')];
      expect(slottedItems.length).to.be.greaterThan(0);
      const active = document.activeElement;
      expect(active === slottedItems[0] || slottedItems[0].contains(active)).to.be.true;
    });
  });

  describe('light DOM rendering of hidden items', () => {
    let wrapper;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 200px;">
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a">Alpha</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a/b">Beta</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/a/b/c">Gamma label here</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Current page label</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        </div>
      `);
      breadcrumbs = wrapper.querySelector('vaadin-breadcrumbs');
      await nextRender();
      await nextResize(breadcrumbs);
    });

    it('should render a slotted vaadin-breadcrumbs-item per hidden item in light DOM', () => {
      const allItems = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      const hidden = allItems.filter((item) => item.hasAttribute('data-overflow-hidden'));
      const slotted = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]')];

      expect(slotted.length).to.equal(hidden.length);
      expect(slotted.length).to.be.greaterThan(0);
    });

    it('should give each slotted overlay item a path matching the hidden item', () => {
      const allItems = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      const hidden = allItems.filter((item) => item.hasAttribute('data-overflow-hidden') && !item.hasAttribute('slot'));
      // Filter the slotted overlay items so we exclude the original ones.
      const slotted = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]')];

      const hiddenPaths = hidden.map((i) => i.getAttribute('path')).filter(Boolean);
      const slottedPaths = slotted.map((i) => i.getAttribute('path'));
      hiddenPaths.forEach((p) => {
        expect(slottedPaths).to.include(p);
      });
    });

    it('should project slotted overlay items into the overlay default slot', async () => {
      const button = breadcrumbs.shadowRoot.querySelector('[part="overflow-button"]');
      const overlay = breadcrumbs.shadowRoot.querySelector('vaadin-breadcrumbs-overlay');
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      const slotted = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]')];
      const content = overlay.shadowRoot.querySelector('[part="content"]');
      const defaultSlot = content.querySelector('slot:not([name])');
      expect(defaultSlot).to.be.ok;
      const assigned = defaultSlot.assignedElements({ flatten: true });
      slotted.forEach((item) => {
        expect(assigned).to.include(item);
      });
    });

    it('should re-render the slotted overlay items when the hidden set changes', async () => {
      const initialCount = breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]').length;

      wrapper.style.width = '400px';
      await nextResize(breadcrumbs);

      const widerCount = breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item[slot="overlay"]').length;
      expect(widerCount).to.not.equal(initialCount);
    });
  });
});
