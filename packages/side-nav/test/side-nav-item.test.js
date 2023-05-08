import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../enable.js';
import '../vaadin-side-nav-item.js';

describe('side-nav-item', () => {
  let sideNavItem;

  beforeEach(() => {
    sideNavItem = fixtureSync('<vaadin-side-nav-item>Label</vaadin-side-nav-item>');
  });

  it('should have a correct localName', () => {
    expect(sideNavItem.localName).to.be.equal('vaadin-side-nav-item');
  });

  it('should have the correct label', () => {
    expect(sideNavItem.textContent).to.be.equal('Label');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = sideNavItem.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });
});

describe('expand', () => {
  describe('passive item with children', () => {
    let passiveItemWithChildren;

    beforeEach(async () => {
      passiveItemWithChildren = fixtureSync(`
      <vaadin-side-nav-item path="/another-path">
        <vaadin-side-nav-item slot="children">Child 1</vaadin-side-nav-item>
        <vaadin-side-nav-item slot="children">Child 2</vaadin-side-nav-item>
      </vaadin-side-nav-item>`);
      await nextRender(passiveItemWithChildren);
    });

    it('should not be expanded', () => {
      expect(passiveItemWithChildren.expanded).to.be.false;
    });

    it('should have a toggle button', async () => {
      expect(passiveItemWithChildren._button).to.be.ok;
    });

    it('should expand when toggle button is clicked', () => {
      passiveItemWithChildren._button.click();
      expect(passiveItemWithChildren.expanded).to.be.true;
    });

    it('should collapse when toggle button is clicked', () => {
      passiveItemWithChildren._button.click();
      passiveItemWithChildren._button.click();
      expect(passiveItemWithChildren.expanded).to.be.false;
    });

    it('should dispatch expanded-changed event when expanded changes', async () => {
      const spy = sinon.spy();
      passiveItemWithChildren.addEventListener('expanded-changed', spy);
      passiveItemWithChildren._button.click();
      await nextRender(passiveItemWithChildren);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('active item with children', () => {
    let activeItemWithChildren;

    beforeEach(async () => {
      activeItemWithChildren = fixtureSync(`
      <vaadin-side-nav-item path="">
        <vaadin-side-nav-item slot="children">Child 1</vaadin-side-nav-item>
        <vaadin-side-nav-item slot="children">Child 2</vaadin-side-nav-item>
      </vaadin-side-nav-item>`);
      await nextRender(activeItemWithChildren);
    });

    it('should be expanded', () => {
      expect(activeItemWithChildren.expanded).to.be.true;
    });

    it('should have a toggle button', async () => {
      expect(activeItemWithChildren._button).to.be.ok;
    });

    it('should collapse when toggle button is clicked', () => {
      activeItemWithChildren._button.click();
      expect(activeItemWithChildren.expanded).to.be.false;
    });

    it('should expand when toggle button is clicked', () => {
      activeItemWithChildren._button.click();
      activeItemWithChildren._button.click();
      expect(activeItemWithChildren.expanded).to.be.true;
    });
  });

  describe('item without children', () => {
    let itemWithoutChildren;

    beforeEach(() => {
      itemWithoutChildren = fixtureSync('<vaadin-side-nav-item></vaadin-side-nav-item>');
    });

    it('should not have a toggle button', () => {
      expect(itemWithoutChildren._button).to.be.not.ok;
    });
  });
});

describe('active', () => {
  describe('read-only', () => {
    it('should retain active state', () => {
      const activeItem = fixtureSync(`<vaadin-side-nav-item path=""></vaadin-side-nav-item>`);
      activeItem.active = false;
      expect(activeItem.active).to.be.true;
    });
  });

  describe('passive item', () => {
    let passiveItem;

    beforeEach(() => {
      passiveItem = fixtureSync(`<vaadin-side-nav-item path="/another-path"></vaadin-side-nav-item>`);
    });

    it('should not be expanded', () => {
      expect(passiveItem.expanded).to.be.false;
    });

    it('should not be active', () => {
      expect(passiveItem.active).to.be.false;
    });
  });

  describe('active item', () => {
    let activeItem;

    beforeEach(() => {
      activeItem = fixtureSync(`<vaadin-side-nav-item path=""></vaadin-side-nav-item>`);
    });

    it('should be expanded', () => {
      expect(activeItem.expanded).to.be.true;
    });

    it('should be active', () => {
      expect(activeItem.active).to.be.true;
    });
  });
});

describe('navigation', () => {
  let anchor, item;

  beforeEach(async () => {
    item = fixtureSync('<vaadin-side-nav-item></vaadin-side-nav-item>');
    await nextRender(item);
    anchor = item.shadowRoot.querySelector('a');
  });

  it('item without path should not contain href in anchor', () => {
    expect(anchor.getAttribute('href')).to.be.not.ok;
  });

  it('item with empty path should contain empty href in anchor', async () => {
    item.path = '';
    await nextRender(item);
    expect(anchor.getAttribute('href')).to.be.empty;
  });

  it('item with path should contain href in anchor', async () => {
    item.path = '/path';
    await nextRender(item);
    expect(anchor.getAttribute('href')).to.be.ok;
  });

  it('should not trigger navigation when toggle button is clicked', async () => {
    const spy = sinon.spy();
    anchor.addEventListener('click', spy);
    item._button.click();
    expect(spy.called).to.be.false;
  });
});
