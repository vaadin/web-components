import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
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

  describe('ARIA roles', () => {
    it('should set "navigation" role by default on the host', async () => {
      const host = fixtureSync('<vaadin-breadcrumbs></vaadin-breadcrumbs>');
      await nextRender();
      expect(host.getAttribute('role')).to.equal('navigation');
    });

    it('should preserve a custom role on the host', async () => {
      const host = fixtureSync('<vaadin-breadcrumbs role="presentation"></vaadin-breadcrumbs>');
      await nextRender();
      expect(host.getAttribute('role')).to.equal('presentation');
    });
  });

  describe('rendering', () => {
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

    it('should distribute items through the default slot in document order', () => {
      const slot = breadcrumbs.shadowRoot.querySelector('[part="list"] slot:not([name])');
      const assigned = slot.assignedElements();
      expect(assigned).to.have.lengthOf(3);
      expect(assigned[0].textContent.trim()).to.equal('Home');
      expect(assigned[1].textContent.trim()).to.equal('Docs');
      expect(assigned[2].textContent.trim()).to.equal('Current');
    });

    it('should set current on the last item when it has no path', () => {
      expect(items[0].hasAttribute('current')).to.be.false;
      expect(items[1].hasAttribute('current')).to.be.false;
      expect(items[2].hasAttribute('current')).to.be.true;
    });

    it('should apply aria-current="page" to the inner [part="nolink"] of the current item only', () => {
      const nolink = items[2].shadowRoot.querySelector('[part="nolink"]');
      expect(nolink).to.exist;
      expect(nolink.getAttribute('aria-current')).to.equal('page');

      // Linked items render a [part="link"], no aria-current anywhere.
      expect(items[0].shadowRoot.querySelector('[part="link"]').hasAttribute('aria-current')).to.be.false;
      expect(items[1].shadowRoot.querySelector('[part="link"]').hasAttribute('aria-current')).to.be.false;
    });

    it('should not set current on any item when the last item has a path', async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs/api">API</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
      const all = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      all.forEach((item) => {
        expect(item.hasAttribute('current')).to.be.false;
      });
    });

    it('should clear current on the last item when its path is set', async () => {
      expect(items[2].hasAttribute('current')).to.be.true;
      items[2].setAttribute('path', '/now-linked');
      await nextRender();
      expect(items[2].hasAttribute('current')).to.be.false;
    });

    it('should set current on the last item when its path is removed', async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs/api">API</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
      const all = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      expect(all[2].hasAttribute('current')).to.be.false;

      all[2].removeAttribute('path');
      await nextRender();

      expect(all[2].hasAttribute('current')).to.be.true;
    });

    it('should reassign current to the new last item after replaceChildren()', async () => {
      const a = document.createElement('vaadin-breadcrumbs-item');
      a.path = '/a';
      a.textContent = 'A';
      const b = document.createElement('vaadin-breadcrumbs-item');
      b.path = '/b';
      b.textContent = 'B';
      const c = document.createElement('vaadin-breadcrumbs-item');
      c.textContent = 'C';

      breadcrumbs.replaceChildren(a, b, c);
      await nextRender();

      expect(a.hasAttribute('current')).to.be.false;
      expect(b.hasAttribute('current')).to.be.false;
      expect(c.hasAttribute('current')).to.be.true;
    });

    it('should re-evaluate current when a new item is appended', async () => {
      // Initially items[2] (no path) is current.
      expect(items[2].hasAttribute('current')).to.be.true;

      const appended = document.createElement('vaadin-breadcrumbs-item');
      appended.textContent = 'Appended';
      breadcrumbs.appendChild(appended);
      await nextRender();

      expect(items[2].hasAttribute('current')).to.be.false;
      expect(appended.hasAttribute('current')).to.be.true;
    });

    it('should re-evaluate current when the last item is removed', async () => {
      expect(items[2].hasAttribute('current')).to.be.true;

      // Remove the last item; previous item has a path so it should not become current.
      items[2].remove();
      await nextRender();

      expect(items[1].hasAttribute('current')).to.be.false;
      expect(items[0].hasAttribute('current')).to.be.false;
    });

    it('should re-evaluate current when the last item is removed and previous has no path', async () => {
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item>Middle</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/docs/api">API</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
      const all = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      // Last item has a path, so no current initially.
      expect(all[1].hasAttribute('current')).to.be.false;
      expect(all[2].hasAttribute('current')).to.be.false;

      // Remove the last (linked) item; the new last has no path → becomes current.
      all[2].remove();
      await nextRender();

      expect(all[1].hasAttribute('current')).to.be.true;
    });
  });
});
