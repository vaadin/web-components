import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumbs-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs-item', () => {
  let item;

  beforeEach(() => {
    item = fixtureSync('<vaadin-breadcrumbs-item></vaadin-breadcrumbs-item>');
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

  describe('has-prefix re-observing', () => {
    describe('without prefix', () => {
      beforeEach(async () => {
        await nextRender();
      });

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
    });

    describe('with prefix and path', () => {
      beforeEach(async () => {
        item = fixtureSync(`
          <vaadin-breadcrumbs-item path="/foo">
            <span slot="prefix"></span>
          </vaadin-breadcrumbs-item>
        `);
        await nextRender();
      });

      it('should keep has-prefix after switching from link to nolink branch', async () => {
        item.path = null;
        await nextRender();

        expect(item.hasAttribute('has-prefix')).to.be.true;
      });
    });
  });
});
