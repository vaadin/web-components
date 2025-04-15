import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-virtual-list.js';

describe('virtual-list', () => {
  let list;

  beforeEach(async () => {
    list = fixtureSync(`<vaadin-virtual-list></vaadin-virtual-list>`);
    await nextFrame();
  });

  it('should have a default height', () => {
    expect(list.offsetHeight).to.equal(400);
  });

  it('should override default height', () => {
    list.style.height = '100px';
    expect(list.offsetHeight).to.equal(100);
  });

  it('should hide the list', () => {
    list.hidden = true;
    expect(list.offsetHeight).to.equal(0);
  });

  it('should not create elements if renderer is missing', () => {
    list.items = [0];
    expect(list.children.length).to.equal(0);
  });

  it('should not collapse inside a flexbox', () => {
    const flexBox = fixtureSync(`
      <div style="display:flex">
        <vaadin-virtual-list></vaadin-virtual-list>
      </div>`);

    expect(flexBox.firstElementChild.offsetWidth).to.equal(flexBox.offsetWidth);
  });

  it('should have role="list"', () => {
    expect(list.role).to.equal('list');
  });

  describe('with items', () => {
    beforeEach(async () => {
      const size = 100;

      list.items = new Array(size).fill().map((_, i) => {
        return { value: `value-${i}` };
      });

      list.renderer = (el, _list, model) => {
        el.textContent = model.item.value;
      };

      await nextFrame();
    });

    it('should include div elements', () => {
      expect(list.childElementCount).be.above(0);
      expect(list.children[0].localName).to.equal('div');
    });

    it('should hide all the item elements', () => {
      list.items = undefined;
      [...list.children].forEach((el) => expect(el.hidden).to.be.true);
    });

    it('should not throw on missing renderer', () => {
      list.renderer = undefined;
      expect(() => list.scrollToIndex(50)).not.to.throw();
    });

    it('should change the items to an array of same size', () => {
      list.items = new Array(list.items.length).fill().map((_, i) => {
        return { value: `text-${i}` };
      });
      expect(list.children[0].textContent.trim()).to.equal('text-0');
    });

    it('should change the items to a shorter array', () => {
      list.items = new Array(list.items.length - 1).fill().map((_, i) => {
        return { value: `text-${i}` };
      });
      expect(list.children[0].textContent.trim()).to.equal('text-0');
    });

    it('should scroll to index', () => {
      list.scrollToIndex(50);

      const listRect = list.getBoundingClientRect();
      const firstVisibleElement = list.getRootNode().elementFromPoint(listRect.left, listRect.top);
      expect(firstVisibleElement.textContent.trim()).to.equal('value-50');
    });

    it('should have full width items', () => {
      expect(list.firstElementChild.offsetWidth).to.equal(list.offsetWidth);
    });

    it('should have a first visible index', () => {
      const item = [...list.children].find((el) => el.textContent === `value-${list.firstVisibleIndex}`);
      const itemRect = item.getBoundingClientRect();
      expect(list.getBoundingClientRect().top).to.be.within(itemRect.top, itemRect.bottom);
    });

    it('should have a last visible index', () => {
      const item = [...list.children].find((el) => el.textContent === `value-${list.lastVisibleIndex}`);
      const itemRect = item.getBoundingClientRect();
      expect(list.getBoundingClientRect().bottom).to.be.within(itemRect.top, itemRect.bottom + 1);
    });

    it('should clear the old content after assigning a new renderer', () => {
      list.renderer = () => {};
      expect(list.children[0].textContent.trim()).to.equal('');
    });

    it('should clear the old content after removing the renderer', () => {
      list.renderer = null;
      expect(list.children[0].textContent.trim()).to.equal('');
    });

    it('should update content on request', () => {
      let name = 'foo';
      list.renderer = (root) => {
        root.textContent = name;
      };
      expect(list.children[0].textContent.trim()).to.equal('foo');

      name = 'bar';
      list.requestContentUpdate();
      expect(list.children[0].textContent.trim()).to.equal('bar');
    });

    it('should have items with role="listitem"', () => {
      expect(list.children[0].role).to.equal('listitem');
    });

    it('should assign aria-setsize and aria-posinset', () => {
      list.scrollToIndex(list.items.length - 1);
      const item = [...list.children].find((el) => el.textContent === `value-${list.lastVisibleIndex}`);
      expect(item.ariaSetSize).to.equal('100');
      expect(item.ariaPosInSet).to.equal('100');
    });

    describe('item accessible name generator', () => {
      beforeEach(async () => {
        list.itemAccessibleNameGenerator = (item) => `Accessible ${item.value}`;
        await nextFrame();
      });

      it('should generate aria-label to the items', () => {
        expect(list.children[0].ariaLabel).to.equal('Accessible value-0');
      });

      it('should remove aria-label from the items', async () => {
        list.itemAccessibleNameGenerator = undefined;
        await nextFrame();
        expect(list.children[0].ariaLabel).to.be.null;
      });
    });

    describe('overflow attribute', () => {
      it('should set overflow attribute to "bottom" when scroll is at the beginning', () => {
        expect(list.getAttribute('overflow')).to.equal('bottom');
      });

      it('should set overflow attribute to "top bottom" when scroll is at the middle', async () => {
        list.scrollToIndex(50);
        await nextFrame();
        expect(list.getAttribute('overflow')).to.equal('top bottom');
      });

      it('should set overflow attribute to "top" when scroll is at the end', async () => {
        list.scrollToIndex(100);
        await nextFrame();
        expect(list.getAttribute('overflow')).to.equal('top');
      });
    });

    describe('scroll restoration', () => {
      it('should restore scroll position when moving within DOM', () => {
        list.scrollToIndex(50);
        const top = list.scrollTop;

        const wrapper = fixtureSync('<div></div>');
        wrapper.appendChild(list);

        expect(list.scrollTop).to.equal(top);
      });
    });
  });
});
