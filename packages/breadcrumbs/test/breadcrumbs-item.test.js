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

  describe('path-driven rendering', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumbs-item>Home</vaadin-breadcrumbs-item>');
      await nextRender();
    });

    describe('with path set', () => {
      beforeEach(async () => {
        item.path = '/foo';
        await nextRender();
      });

      it('should render exactly one [part="link"] <a> element with matching href', () => {
        const links = item.shadowRoot.querySelectorAll('[part="link"]');
        expect(links.length).to.equal(1);
        expect(links[0].localName).to.equal('a');
        expect(links[0].getAttribute('href')).to.equal('/foo');
      });

      it('should not render a [part="nolink"] element', () => {
        expect(item.shadowRoot.querySelector('[part="nolink"]')).to.be.null;
      });

      it('should render a [part="label"] wrapping the default <slot>', () => {
        const label = item.shadowRoot.querySelector('[part="label"]');
        expect(label).to.be.ok;
        const slot = label.querySelector('slot:not([name])');
        expect(slot).to.be.ok;
      });

      it('should nest [part="label"] inside [part="link"]', () => {
        const link = item.shadowRoot.querySelector('[part="link"]');
        const label = item.shadowRoot.querySelector('[part="label"]');
        expect(link.contains(label)).to.be.true;
      });

      it('should project slotted text into [part="label"]', () => {
        const slot = item.shadowRoot.querySelector('[part="label"] slot:not([name])');
        const assigned = slot.assignedNodes({ flatten: true });
        const projectedText = assigned.map((node) => node.textContent.trim()).filter((text) => text.length > 0);
        expect(projectedText).to.include('Home');
      });

      it('should update href when path changes to a new value', async () => {
        item.path = '/a';
        await nextRender();
        let link = item.shadowRoot.querySelector('[part="link"]');
        expect(link.href.endsWith('/a')).to.be.true;

        item.path = '/b';
        await nextRender();
        link = item.shadowRoot.querySelector('[part="link"]');
        expect(link.href.endsWith('/b')).to.be.true;
      });
    });

    describe('without path set', () => {
      it('should render exactly one [part="nolink"] <span> element with no href attribute', () => {
        const nolinks = item.shadowRoot.querySelectorAll('[part="nolink"]');
        expect(nolinks.length).to.equal(1);
        expect(nolinks[0].localName).to.equal('span');
        expect(nolinks[0].hasAttribute('href')).to.be.false;
      });

      it('should not render a [part="link"] element', () => {
        expect(item.shadowRoot.querySelector('[part="link"]')).to.be.null;
      });

      it('should render a [part="label"] wrapping the default <slot>', () => {
        const label = item.shadowRoot.querySelector('[part="label"]');
        expect(label).to.be.ok;
        const slot = label.querySelector('slot:not([name])');
        expect(slot).to.be.ok;
      });

      it('should nest [part="label"] inside [part="nolink"]', () => {
        const nolink = item.shadowRoot.querySelector('[part="nolink"]');
        const label = item.shadowRoot.querySelector('[part="label"]');
        expect(nolink.contains(label)).to.be.true;
      });

      it('should project slotted text into [part="label"]', () => {
        const slot = item.shadowRoot.querySelector('[part="label"] slot:not([name])');
        const assigned = slot.assignedNodes({ flatten: true });
        const projectedText = assigned.map((node) => node.textContent.trim()).filter((text) => text.length > 0);
        expect(projectedText).to.include('Home');
      });
    });

    describe('switching between renderings', () => {
      it('should swap from [part="nolink"] to [part="link"] when path is set', async () => {
        expect(item.shadowRoot.querySelector('[part="nolink"]')).to.be.ok;
        expect(item.shadowRoot.querySelector('[part="link"]')).to.be.null;

        item.path = '/foo';
        await nextRender();

        expect(item.shadowRoot.querySelector('[part="link"]')).to.be.ok;
        expect(item.shadowRoot.querySelector('[part="nolink"]')).to.be.null;
      });

      it('should swap from [part="link"] to [part="nolink"] when path is set to null', async () => {
        item.path = '/foo';
        await nextRender();
        expect(item.shadowRoot.querySelector('[part="link"]')).to.be.ok;

        item.path = null;
        await nextRender();

        expect(item.shadowRoot.querySelector('[part="nolink"]')).to.be.ok;
        expect(item.shadowRoot.querySelector('[part="link"]')).to.be.null;
      });

      it('should swap from [part="link"] to [part="nolink"] when path is set to undefined', async () => {
        item.path = '/foo';
        await nextRender();
        expect(item.shadowRoot.querySelector('[part="link"]')).to.be.ok;

        item.path = undefined;
        await nextRender();

        expect(item.shadowRoot.querySelector('[part="nolink"]')).to.be.ok;
        expect(item.shadowRoot.querySelector('[part="link"]')).to.be.null;
      });
    });
  });
});
