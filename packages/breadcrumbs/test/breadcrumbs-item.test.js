import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumbs.js';
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

  describe('ARIA roles', () => {
    it('should set "listitem" role by default on the host', async () => {
      const defaultItem = fixtureSync('<vaadin-breadcrumbs-item></vaadin-breadcrumbs-item>');
      await nextRender();
      expect(defaultItem.getAttribute('role')).to.equal('listitem');
    });

    it('should preserve a custom role on the host', async () => {
      const customItem = fixtureSync('<vaadin-breadcrumbs-item role="presentation"></vaadin-breadcrumbs-item>');
      await nextRender();
      expect(customItem.getAttribute('role')).to.equal('presentation');
    });
  });

  describe('separator', () => {
    let breadcrumbs, items;

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
      const first = getComputedStyle(items[0], '::after');
      expect(first.display).to.not.equal('none');
      expect(first.maskImage).to.not.equal('none');
      expect(first.maskImage).to.not.equal('');

      const second = getComputedStyle(items[1], '::after');
      expect(second.display).to.not.equal('none');
      expect(second.maskImage).to.not.equal('none');
      expect(second.maskImage).to.not.equal('');
    });

    it('should hide the ::after separator on the last item via :last-of-type', () => {
      const last = getComputedStyle(items[2], '::after');
      expect(last.display).to.equal('none');
    });

    it('should hide the ::after separator on an item with current attribute', async () => {
      // Re-fixture so the last item has no path → parent applies current.
      breadcrumbs = fixtureSync(`
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item path="/after">After</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `);
      await nextRender();
      const all = [...breadcrumbs.querySelectorAll('vaadin-breadcrumbs-item')];
      // Force current on a non-last item to verify [current] hides the separator
      // regardless of position. Use the public reflected attribute path.
      all[1]._setCurrent(true);
      await nextRender();

      expect(all[1].hasAttribute('current')).to.be.true;
      const middle = getComputedStyle(all[1], '::after');
      expect(middle.display).to.equal('none');
    });

    it('should resolve the default mask-image to the chevron-right SVG', () => {
      const maskImage = getComputedStyle(items[0], '::after').maskImage;
      expect(maskImage).to.include('m9 18 6-6-6-6');
    });

    it('should propagate --vaadin-breadcrumbs-separator override to every item', () => {
      breadcrumbs.style.setProperty(
        '--vaadin-breadcrumbs-separator',
        'url(\'data:image/svg+xml;utf8,<svg id="custom-separator"/>\')',
      );

      const first = getComputedStyle(items[0], '::after').maskImage;
      const second = getComputedStyle(items[1], '::after').maskImage;
      expect(first).to.include('custom-separator');
      expect(second).to.include('custom-separator');
    });

    it('should resolve background to the host currentColor', () => {
      breadcrumbs.style.color = 'rgb(255, 0, 0)';
      const bg = getComputedStyle(items[0], '::after').backgroundColor;
      expect(bg).to.equal('rgb(255, 0, 0)');
    });
  });
});
