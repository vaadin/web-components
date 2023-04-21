import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
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

    beforeEach(() => {
      passiveItemWithChildren = fixtureSync(`
      <vaadin-side-nav-item path="/another-path">
        <vaadin-side-nav-item slot="children">Child 1</vaadin-side-nav-item>
        <vaadin-side-nav-item slot="children">Child 2</vaadin-side-nav-item>
      </vaadin-side-nav-item>`);
    });

    it('should have a toggle button', async () => {
      await nextRender(passiveItemWithChildren);
      expect(passiveItemWithChildren.button).to.be.ok;
    });

    it('should expand programmatically', () => {
      passiveItemWithChildren.toggleExpanded();
      expect(passiveItemWithChildren.expanded).to.be.true;
    });

    it('should collapse programmatically', () => {
      passiveItemWithChildren.toggleExpanded();
      passiveItemWithChildren.toggleExpanded();
      expect(passiveItemWithChildren.expanded).to.be.false;
    });

    it('should expand when toggle button is clicked', async () => {
      await nextRender(passiveItemWithChildren);
      passiveItemWithChildren.button.click();
      expect(passiveItemWithChildren.expanded).to.be.true;
    });

    it('should collapse when toggle button is clicked', async () => {
      await nextRender(passiveItemWithChildren);
      passiveItemWithChildren.button.click();
      passiveItemWithChildren.button.click();
      expect(passiveItemWithChildren.expanded).to.be.false;
    });
  });

  describe('active item with children', () => {
    let activeItemWithChildren;

    beforeEach(() => {
      activeItemWithChildren = fixtureSync(`
      <vaadin-side-nav-item>
        <vaadin-side-nav-item slot="children">Child 1</vaadin-side-nav-item>
        <vaadin-side-nav-item slot="children">Child 2</vaadin-side-nav-item>
      </vaadin-side-nav-item>`);
    });

    it('should have a toggle button', async () => {
      await nextRender(activeItemWithChildren);
      expect(activeItemWithChildren.button).to.be.ok;
    });

    it('should collapse programmatically', () => {
      activeItemWithChildren.toggleExpanded();
      expect(activeItemWithChildren.expanded).to.be.false;
    });

    it('should expand programmatically', () => {
      activeItemWithChildren.toggleExpanded();
      activeItemWithChildren.toggleExpanded();
      expect(activeItemWithChildren.expanded).to.be.true;
    });

    it('should collapse when toggle button is clicked', async () => {
      await nextRender(activeItemWithChildren);
      activeItemWithChildren.button.click();
      expect(activeItemWithChildren.expanded).to.be.false;
    });

    it('should expand when toggle button is clicked', async () => {
      await nextRender(activeItemWithChildren);
      activeItemWithChildren.button.click();
      activeItemWithChildren.button.click();
      expect(activeItemWithChildren.expanded).to.be.true;
    });
  });

  describe('item without children', () => {
    let itemWithoutChildren;

    beforeEach(() => {
      itemWithoutChildren = fixtureSync('<vaadin-side-nav-item>Passive item</vaadin-side-nav-item>');
    });

    it('should not have a toggle button', () => {
      expect(itemWithoutChildren.button).to.be.not.ok;
    });
  });
});

describe('active', () => {
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
      activeItem = fixtureSync(`<vaadin-side-nav-item></vaadin-side-nav-item>`);
    });

    it('should be expanded', () => {
      expect(activeItem.expanded).to.be.true;
    });

    it('should be active', () => {
      expect(activeItem.active).to.be.true;
    });
  });
});

describe('prefix', () => {
  let item;
  let prefixSlot;
  let prefixContent;

  beforeEach(async () => {
    item = fixtureSync(
      `<vaadin-side-nav-item>
          <vaadin-icon icon="vaadin:folder-open" slot="prefix"></vaadin-icon>
        </vaadin-side-nav-item>`,
    );
    await nextRender(item);
    prefixSlot = item.shadowRoot.querySelector('slot[name="prefix"]');
    prefixContent = item.querySelector('vaadin-icon');
  });

  it('should have prefix slot', () => {
    expect(prefixSlot).to.be.ok;
  });

  it('should have prefix content', () => {
    expect(prefixContent).to.be.ok;
  });

  it('prefix slot should contain prefix content', () => {
    expect(prefixSlot.assignedNodes()).to.contain(prefixContent);
  });
});

describe('suffix', () => {
  let item;
  let suffixSlot;
  let suffixContent;

  beforeEach(async () => {
    item = fixtureSync(
      `<vaadin-side-nav-item>
          <span slot="suffix">Suffix content</span>
        </vaadin-side-nav-item>`,
    );
    await nextRender(item);
    suffixSlot = item.shadowRoot.querySelector('slot[name="suffix"]');
    suffixContent = item.querySelector('span');
  });

  it('should have suffix slot', () => {
    expect(suffixSlot).to.be.ok;
  });

  it('should have suffix content', () => {
    expect(suffixContent).to.be.ok;
  });

  it('prefix slot should contain suffix content', () => {
    expect(suffixSlot.assignedNodes()).to.contain(suffixContent);
  });
});
