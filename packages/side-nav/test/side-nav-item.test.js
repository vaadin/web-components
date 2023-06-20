import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../enable.js';
import '../vaadin-side-nav-item.js';

describe('side-nav-item', () => {
  let item;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      item = fixtureSync('<vaadin-side-nav-item>Label</vaadin-side-nav-item>');
      tagName = item.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('has-children', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-side-nav-item></vaadin-side-nav-item>');
      await nextRender();
    });

    it('should not have has-children attribute by default', () => {
      expect(item.hasAttribute('has-children')).to.be.false;
    });

    it('should set has-children attribute when adding child item', async () => {
      const child = document.createElement('vaadin-side-nav-item');
      child.setAttribute('slot', 'children');

      item.appendChild(child);
      await nextRender();

      expect(item.hasAttribute('has-children')).to.be.true;
    });

    it('should remove has-children attribute when removing child item', async () => {
      const child = document.createElement('vaadin-side-nav-item');
      child.setAttribute('slot', 'children');

      item.appendChild(child);
      await nextRender();

      item.removeChild(child);
      await nextRender();

      expect(item.hasAttribute('has-children')).to.be.false;
    });
  });

  describe('active', () => {
    beforeEach(async () => {
      item = fixtureSync(`<vaadin-side-nav-item path=""></vaadin-side-nav-item>`);
      await nextRender();
    });

    it('should set active property to true for matching path', () => {
      expect(item.active).to.be.true;
    });

    it('should reflect active property to attribute', () => {
      expect(item.hasAttribute('active')).to.be.true;
    });

    it('should disallow changing active property to false', async () => {
      item.active = false;
      await item.updateComplete;
      expect(item.active).to.be.true;
    });
  });

  describe('inactive', () => {
    beforeEach(async () => {
      item = fixtureSync(`<vaadin-side-nav-item path="/another-path"></vaadin-side-nav-item>`);
      await nextRender();
    });

    it('should set active property to false when path does not match', () => {
      expect(item.active).to.be.false;
    });

    it('should not set active attribute when active is set to false', () => {
      expect(item.hasAttribute('active')).to.be.false;
    });
  });

  describe('path aliases', () => {
    beforeEach(async () => {
      item = fixtureSync(`<vaadin-side-nav-item path="/path" path-aliases="/"></vaadin-side-nav-item>`);
      await nextRender();
    });

    it('should set active property to true for matching alias with path', () => {
      expect(item.active).to.be.true;
    });

    it('should set active property to false for matching alias without path', async () => {
      item.path = undefined;
      await item.updateComplete;
      expect(item.active).to.be.false;
    });

    it('should update active property when aliases are updated', async () => {
      item.pathAliases = 'aliases';
      await item.updateComplete;
      expect(item.active).to.be.false;
    });

    it('should set active property to true for matching empty alias', async () => {
      item.pathAliases = '';
      await item.updateComplete;
      expect(item.active).to.be.true;
    });

    it('should set active property to true for a match in multiple aliases', async () => {
      item.pathAliases = '/alias,/';
      await item.updateComplete;
      expect(item.active).to.be.true;
    });
  });

  describe('expanded', () => {
    let toggle;

    describe('inactive item with children', () => {
      beforeEach(async () => {
        item = fixtureSync(`
          <vaadin-side-nav-item path="/another-path">
            <vaadin-side-nav-item slot="children">Child 1</vaadin-side-nav-item>
            <vaadin-side-nav-item slot="children">Child 2</vaadin-side-nav-item>
          </vaadin-side-nav-item>
        `);
        await nextRender();
        toggle = item.shadowRoot.querySelector('button');
      });

      it('should set expanded property to false by default', () => {
        expect(item.expanded).to.be.false;
      });

      it('should expand item on first toggle button click', () => {
        toggle.click();
        expect(item.expanded).to.be.true;
      });

      it('should collapse item on subsequent toggle button click', () => {
        toggle.click();
        toggle.click();
        expect(item.expanded).to.be.false;
      });

      it('should dispatch expanded-changed event when expanded changes', async () => {
        const spy = sinon.spy();
        item.addEventListener('expanded-changed', spy);
        toggle.click();
        await item.updateComplete;
        expect(spy.calledOnce).to.be.true;
      });
    });

    describe('active item with children', () => {
      beforeEach(async () => {
        item = fixtureSync(`
          <vaadin-side-nav-item path="">
            <vaadin-side-nav-item slot="children">Child 1</vaadin-side-nav-item>
            <vaadin-side-nav-item slot="children">Child 2</vaadin-side-nav-item>
          </vaadin-side-nav-item>
        `);
        await nextRender();
        toggle = item.shadowRoot.querySelector('button');
      });

      it('should set expanded property to true by default', () => {
        expect(item.expanded).to.be.true;
      });

      it('should collapse item on first toggle button click', () => {
        toggle.click();
        expect(item.expanded).to.be.false;
      });

      it('should expand item on subsequent toggle button click', () => {
        toggle.click();
        toggle.click();
        expect(item.expanded).to.be.true;
      });
    });

    describe('content part', () => {
      let content;

      beforeEach(async () => {
        item = fixtureSync(`
          <vaadin-side-nav-item>
            <vaadin-side-nav-item slot="children">Child 1</vaadin-side-nav-item>
            <vaadin-side-nav-item slot="children">Child 2</vaadin-side-nav-item>
          </vaadin-side-nav-item>
        `);
        await nextRender();
        content = item.shadowRoot.querySelector('[part="content"]');
      });

      it('should toggle expanded state on content click when item has children', async () => {
        expect(item.expanded).to.be.false;

        content.click();
        await item.updateComplete;
        expect(item.expanded).to.be.true;

        content.click();
        await item.updateComplete;
        expect(item.expanded).to.be.false;
      });

      it('should not change expanded state on content click when item has valid path', async () => {
        item.path = '/foo';
        await item.updateComplete;
        content.click();
        expect(item.expanded).to.be.false;
      });

      it('should not change expanded state on content click when item has no children', async () => {
        [...item.children].forEach((child) => child.remove());
        await nextRender();
        const spy = sinon.spy(toggle, 'click');
        content.click();
        expect(spy.called).to.be.false;
      });
    });
  });

  describe('navigation', () => {
    let anchor, toggle;

    beforeEach(async () => {
      item = fixtureSync('<vaadin-side-nav-item></vaadin-side-nav-item>');
      await nextRender();
      anchor = item.shadowRoot.querySelector('a');
      toggle = item.shadowRoot.querySelector('button');
    });

    it('should not set anchor href attribute when no path is set', () => {
      expect(anchor.getAttribute('href')).to.be.not.ok;
    });

    it('should set empty href to the anchor when path is empty string', async () => {
      item.path = '';
      await nextRender();
      expect(anchor.getAttribute('href')).to.be.empty;
    });

    it('should set correct anchor attribute when non-empty path is set', async () => {
      item.path = '/path';
      await nextRender();
      expect(anchor.getAttribute('href')).to.be.ok;
    });

    it('should not trigger navigation when toggle button is clicked', async () => {
      const spy = sinon.spy();
      anchor.addEventListener('click', spy);
      toggle.click();
      expect(spy.called).to.be.false;
    });
  });
});
