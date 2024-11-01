import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-virtual-list.js';

describe('virtual-list', () => {
  let list;

  beforeEach(() => {
    list = fixtureSync(`<vaadin-virtual-list></vaadin-virtual-list>`);
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

  describe('with items', () => {
    beforeEach(async () => {
      const size = 100;

      list.items = new Array(size).fill().map((e, i) => {
        return { value: `value-${i}` };
      });

      list.renderer = (el, list, model) => {
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
      list.items = new Array(list.items.length).fill().map((e, i) => {
        return { value: `text-${i}` };
      });
      expect(list.children[0].textContent.trim()).to.equal('text-0');
    });

    it('should change the items to a shorter array', () => {
      list.items = new Array(list.items.length - 1).fill().map((e, i) => {
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
      expect(list.getBoundingClientRect().bottom).to.be.within(itemRect.top, itemRect.bottom);
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
  });
  describe('drag and drop', () => {
    let container;
    let items;

    beforeEach(async () => {
      container = fixtureSync(`
      <div style="width: 300px; height: 300px;">
        <vaadin-virtual-list draggable="true"></vaadin-virtual-list>
      </div>
    `);
      list = container.querySelector('vaadin-virtual-list');
      list.renderer = (root, _, { item }) => {
        root.innerHTML = `<div>${item.label}</div>`;
      };
      document.body.appendChild(container);
      await nextFrame();
      items = list.shadowRoot.querySelector('#items');
    });

    async function setVirtualListItems(count) {
      list.items = Array.from({ length: count }).map((_, i) => {
        return { label: `Item ${i}` };
      });
      await nextFrame();
    }

    function getState() {
      return { itemsMaxHeight: items.style.maxHeight, listOverflow: list.style.overflow };
    }

    function getExpectedDragStartState() {
      return { itemsMaxHeight: '0px', listOverflow: 'hidden' };
    }

    function assertStatesEqual(state1, state2) {
      expect(state1.itemsMaxHeight).to.equal(state2.itemsMaxHeight);
      expect(state1.listOverflow).to.equal(state2.listOverflow);
    }

    async function getStateDuringDragStart(element) {
      let stateDuringDragStart;
      element.addEventListener(
        'dragstart',
        () => {
          stateDuringDragStart = getState();
        },
        { once: true },
      );
      element.dispatchEvent(new DragEvent('dragstart'));
      await new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
      return stateDuringDragStart;
    }

    it('should not change state on dragstart for small virtual lists', async () => {
      await setVirtualListItems(10);
      const initialState = getState();
      const stateDuringDragStart = await getStateDuringDragStart(list);
      assertStatesEqual(stateDuringDragStart, initialState);
      const finalState = getState();
      assertStatesEqual(finalState, initialState);
    });

    ['5000', '50000'].forEach((count) => {
      it('should temporarily change state on dragstart for large virtual lists', async () => {
        await setVirtualListItems(count);
        const initialState = getState();
        const stateDuringDragStart = await getStateDuringDragStart(list);
        assertStatesEqual(stateDuringDragStart, getExpectedDragStartState());
        const finalState = getState();
        assertStatesEqual(finalState, initialState);
      });

      it('should temporarily change state on dragstart for large virtual lists in draggable containers', async () => {
        list.removeAttribute('draggable');
        container.setAttribute('draggable', true);
        await setVirtualListItems(count);
        const initialState = getState();
        const stateDuringDragStart = await getStateDuringDragStart(container);
        assertStatesEqual(stateDuringDragStart, getExpectedDragStartState());
        const finalState = getState();
        assertStatesEqual(finalState, initialState);
      });
    });
  });
});
