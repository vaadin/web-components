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
});
