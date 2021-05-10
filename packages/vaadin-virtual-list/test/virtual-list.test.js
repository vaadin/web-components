import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-virtual-list.js';

describe('virtual-list', () => {
  let list;

  beforeEach(() => {
    list = fixtureSync(`<vaadin-virtual-list></vaadin-virtual-list>`);
  });

  it('should have a default height', () => {
    expect(list.offsetHeight).to.equal(200);
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

  describe('with items', () => {
    beforeEach(() => {
      const size = 100;

      list.items = new Array(size).fill().map((e, i) => {
        return { value: `value-${i}` };
      });

      list.renderer = (el, list, model) => (el.textContent = model.item.value);
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
      list.items = list.items = new Array(list.items.length).fill().map((e, i) => {
        return { value: `text-${i}` };
      });
      expect(list.children[0].textContent.trim()).to.equal('text-0');
    });

    it('should change the items to a shorter array', () => {
      list.items = list.items = new Array(list.items.length - 1).fill().map((e, i) => {
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
  });
});
