import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumbs-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs-item', () => {
  let item;

  beforeEach(async () => {
    item = fixtureSync('<vaadin-breadcrumbs-item></vaadin-breadcrumbs-item>');
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = item.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('has-prefix attribute', () => {
    describe('without prefix', () => {
      it('should set has-prefix when a prefix child is added dynamically', async () => {
        const prefix = document.createElement('span');
        prefix.setAttribute('slot', 'prefix');
        item.appendChild(prefix);
        await nextRender();

        expect(item.hasAttribute('has-prefix')).to.be.true;
      });

      it('should set has-prefix when a prefix child is added after switching branches', async () => {
        item.path = '/foo';
        await nextRender();

        const prefix = document.createElement('span');
        prefix.setAttribute('slot', 'prefix');
        item.appendChild(prefix);
        await nextRender();

        expect(item.hasAttribute('has-prefix')).to.be.true;
      });
    });

    describe('with prefix', () => {
      beforeEach(async () => {
        item = fixtureSync(`
          <vaadin-breadcrumbs-item>
            <span slot="prefix"></span>
          </vaadin-breadcrumbs-item>
        `);
        await nextRender();
      });

      it('should clear has-prefix when the only prefix child is removed', async () => {
        item.querySelector('[slot="prefix"]').remove();
        await nextRender();
        expect(item.hasAttribute('has-prefix')).to.be.false;
      });

      it('should keep has-prefix after switching from nolink to link branch', async () => {
        item.path = '/foo';
        await nextRender();
        expect(item.hasAttribute('has-prefix')).to.be.true;
      });

      it('should keep has-prefix after switching from link to nolink branch', async () => {
        item.path = '/foo';
        await nextRender();

        item.path = null;
        await nextRender();

        expect(item.hasAttribute('has-prefix')).to.be.true;
      });
    });
  });

  describe('current attribute', () => {
    describe('without path', () => {
      it('should set aria-current="page" on [part="nolink"] when current is set', async () => {
        item._setCurrent(true);
        await nextRender();

        const nolink = item.shadowRoot.querySelector('[part="nolink"]');
        expect(nolink).to.be.ok;
        expect(nolink.getAttribute('aria-current')).to.equal('page');
      });

      it('should remove aria-current from [part="nolink"] when current is removed', async () => {
        item._setCurrent(true);
        await nextRender();

        item._setCurrent(false);
        await nextRender();

        const nolink = item.shadowRoot.querySelector('[part="nolink"]');
        expect(nolink).to.be.ok;
        expect(nolink.hasAttribute('aria-current')).to.be.false;
      });

      it('should not set aria-current on [part="nolink"] when current is not set', () => {
        const nolink = item.shadowRoot.querySelector('[part="nolink"]');
        expect(nolink).to.be.ok;
        expect(nolink.hasAttribute('aria-current')).to.be.false;
      });
    });

    describe('with path', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumbs-item path="/foo"></vaadin-breadcrumbs-item>');
        await nextRender();
      });

      it('should not render aria-current anywhere in the shadow root when current is set on a linked item', async () => {
        item._setCurrent(true);
        await nextRender();

        expect(item.shadowRoot.querySelector('[aria-current]')).to.be.null;
      });
    });

    it('should keep aria-current on the nolink branch as path toggles while current is set', async () => {
      item._setCurrent(true);
      await nextRender();

      let nolink = item.shadowRoot.querySelector('[part="nolink"]');
      expect(nolink).to.be.ok;
      expect(nolink.getAttribute('aria-current')).to.equal('page');

      item.path = '/foo';
      await nextRender();

      expect(item.shadowRoot.querySelector('[aria-current]')).to.be.null;

      item.path = null;
      await nextRender();

      nolink = item.shadowRoot.querySelector('[part="nolink"]');
      expect(nolink).to.be.ok;
      expect(nolink.getAttribute('aria-current')).to.equal('page');
      expect(item.shadowRoot.querySelector('[aria-current]')).to.equal(nolink);
    });
  });
});
