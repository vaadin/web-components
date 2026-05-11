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

  describe('role', () => {
    describe('default', () => {
      it('should set role attribute to listitem by default', () => {
        expect(item.getAttribute('role')).to.equal('listitem');
      });
    });

    describe('custom', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumbs-item role="presentation"></vaadin-breadcrumbs-item>');
        await nextRender();
      });

      it('should not override custom role', () => {
        expect(item.getAttribute('role')).to.equal('presentation');
      });
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

  describe('RTL separator flip', () => {
    let breadcrumbs, items;

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

    describe('in RTL document', () => {
      before(() => {
        document.documentElement.setAttribute('dir', 'rtl');
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('should horizontally mirror ::after on items with a visible separator', () => {
        expect(getComputedStyle(items[0], '::after').transform).to.equal('matrix(-1, 0, 0, 1, 0, 0)');
      });
    });

    describe('in LTR document', () => {
      it('should not mirror ::after on items with a visible separator', () => {
        expect(getComputedStyle(items[0], '::after').transform).to.equal('none');
      });
    });

    it('should not declare physical left/right margins or paddings in the component styles', () => {
      const collect = (host) =>
        [...host.shadowRoot.adoptedStyleSheets]
          .flatMap((sheet) => [...sheet.cssRules])
          .map((rule) => rule.cssText)
          .join('\n');
      const css = `${collect(breadcrumbs)}\n${collect(items[0])}`;
      expect(css).to.not.match(/\bmargin-(left|right)\s*:/u);
      expect(css).to.not.match(/\bpadding-(left|right)\s*:/u);
    });
  });
});
