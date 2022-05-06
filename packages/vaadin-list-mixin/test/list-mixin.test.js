import { expect } from '@esm-bundle/chai';
import {
  arrowDown,
  arrowLeft,
  arrowRight,
  arrowUp,
  end,
  fixtureSync,
  home,
  keyDownChar,
  nextFrame,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ListMixin } from '../vaadin-list-mixin.js';
import { MultiSelectListMixin } from '../vaadin-multi-select-list-mixin.js';

customElements.define(
  'test-list-element',
  class extends MultiSelectListMixin(PolymerElement) {
    static get template() {
      return html`
        <style>
          :host {
            display: block;
          }

          #scroll {
            overflow: auto;
            display: flex;
          }

          :host([orientation='vertical']) #scroll {
            height: 100%;
            flex-direction: column;
          }
        </style>
        <div id="scroll">
          <slot></slot>
        </div>
      `;
    }

    get _scrollerElement() {
      return this.$.scroll;
    }
  },
);

customElements.define(
  'test-item-element',
  class extends PolymerElement {
    static get template() {
      return html`
        <style>
          :host {
            display: block;
          }

          :host([hidden]) {
            display: none !important;
          }

          :host(.hidden-attribute) {
            display: none;
          }
        </style>
        <slot></slot>
      `;
    }

    static get properties() {
      return {
        _hasVaadinItemMixin: {
          value: true,
        },
        disabled: {
          type: Boolean,
          observer: '_disabledChanged',
        },
        selected: {
          type: Boolean,
        },
      };
    }

    _disabledChanged(disabled) {
      if (disabled) {
        // Simplified version of Vaadin.ItemMixin behavior
        this.selected = false;
      }
    }
  },
);

describe('vaadin-list-mixin', () => {
  let list;

  describe('items observer', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element>
          <test-item-element>Item 0</test-item-element>
          <test-item-element>Item 1</test-item-element>
          <test-item-element>Item 2</test-item-element>
        </test-list-element>
      `);
    });

    it('should have a list of valid items after the DOM `_observer` has been run', () => {
      // DOM _observer runs asynchronously, we need to flush to access items
      list._observer.flush();
      expect(list.items.length).to.be.equal(3);
    });

    it('`focus` should flush the `_observer` if it is called too soon', () => {
      // Focus flushes the observer in order to be run in 3rd party elements initialization
      list.focus();
      expect(list.items.length).to.be.equal(3);
    });
  });

  describe('DOM', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element>
          <test-item-element>Item 0</test-item-element>
          <test-item-element>Item 1</test-item-element>
          <hr />
          <test-item-element>Item 2</test-item-element>
          <test-item-element>Item 3</test-item-element>
          <hr />
          <test-item-element>Item 4</test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
    });

    it('should update items list when removing nodes', () => {
      expect(list.items.length).to.be.equal(5);
      list.removeChild(list.items[0]);
      list._observer.flush();
      expect(list.items.length).to.be.equal(4);
    });

    it('should update items list when adding nodes', () => {
      list.appendChild(document.createElement('test-item-element'));
      list._observer.flush();
      expect(list.items.length).to.be.equal(6);
    });

    it('should update items list when moving nodes', () => {
      const [e2, e4] = [list.items[2], list.items[4]];

      list.insertBefore(e4, e2);
      list._observer.flush();
      expect(list.items[2]).to.be.equal(e4);
      expect(list.items[3]).to.be.equal(e2);
    });
  });

  describe('selection', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element>
          <test-item-element>Item 0</test-item-element>
          <test-item-element>Item 1</test-item-element>
          <test-item-element>Item 2</test-item-element>
          <test-item-element><span>Item 3</span></test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
    });

    it('should not select any item by default', () => {
      list.items.forEach((item) => {
        expect(item.selected).to.be.false;
      });
    });

    it('should select an item when `selected` property is set', () => {
      list.selected = 3;
      expect(list.items[3].selected).to.be.true;
    });

    it('should clear selection when `selected` property is set to not numeric value', () => {
      list.selected = 3;
      list.selected = undefined;
      expect(list.items[3].selected).to.be.false;
    });

    it('should be selectable with mouse click', () => {
      list.items[3].click();
      expect(list.selected).to.be.equal(3);
    });

    it('should be selectable with mouse click in child elements', () => {
      list.items[3].firstElementChild.click();
      expect(list.selected).to.be.equal(3);
    });
  });

  describe('tabIndex', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element>
          <test-item-element disabled>Item 0</test-item-element>
          <test-item-element disabled>Item 1</test-item-element>
          <test-item-element>Item 2</test-item-element>
          <test-item-element>Item 3</test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
    });

    it('should have the first not disabled item focusable by default', () => {
      [-1, -1, 0, -1].forEach((val, idx) => expect(list.items[idx].tabIndex).to.equal(val));
    });

    it('should set a not disabled item focusable', () => {
      list._setFocusable(3);
      [-1, -1, -1, 0].forEach((val, idx) => expect(list.items[idx].tabIndex).to.equal(val));
    });

    it('should not set a disabled item focusable but the next not disabled item instead', () => {
      list._setFocusable(1);
      [-1, -1, 0, -1].forEach((val, idx) => expect(list.items[idx].tabIndex).to.equal(val));
    });

    it('should call focus() method on the item when setting it focusable', () => {
      list._setFocusable(3);
      const spy = sinon.spy(list.items[3], 'focus');
      list.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('tabIndex when all the items are disabled', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element>
          <test-item-element disabled>Item 0</test-item-element>
          <test-item-element disabled>Item 1</test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
    });

    it('should not have any item focusable', () => {
      expect(list.items[0].tabIndex).to.equal(-1);
      expect(list.items[1].tabIndex).to.equal(-1);
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element>
          <test-item-element>Foo</test-item-element>
          <test-item-element>Bar</test-item-element>
          <test-item-element disabled>Bay</test-item-element>
          <test-item-element><span>Baz</span></test-item-element>
          <test-item-element disabled>Qux</test-item-element>
          <test-item-element><span>Xyzzy</span></test-item-element>
          <test-item-element>Bax</test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
      list._focus(0);
    });

    describe('RTL mode', () => {
      beforeEach(() => {
        list.orientation = 'horizontal';
        list.setAttribute('dir', 'rtl');
      });

      it('should move focus to next element on "arrow-down" keydown', () => {
        list.orientation = 'vertical';
        arrowDown(list);
        expect(list.items[1].focused).to.be.true;
      });

      it('should move focus to prev element on "arrow-up" keydown', () => {
        list.orientation = 'vertical';
        arrowDown(list);
        arrowUp(list);
        expect(list.items[0].focused).to.be.true;
      });

      it('should move focus to next element on "arrow-left" keydown', () => {
        arrowLeft(list);
        expect(list.items[1].focused).to.be.true;
      });

      it('should move focus to prev element on "arrow-right" keydown', () => {
        arrowLeft(list);
        arrowRight(list);
        expect(list.items[0].focused).to.be.true;
      });

      it('should move focus to first element on "home" keydown', () => {
        home(list);
        expect(list.items[0].focused).to.be.true;
      });

      it('should move focus to last element on "end" keydown', () => {
        list._focus(3);
        end(list);
        expect(list.items[6].focused).to.be.true;
      });
    });

    it('should move focus to next element on "arrow-down" keydown', () => {
      arrowDown(list);
      expect(list.items[1].focused).to.be.true;
    });

    it('should move focus to prev element on "arrow-up" keydown', () => {
      arrowDown(list);
      arrowUp(list);
      expect(list.items[0].focused).to.be.true;
    });

    it('should move focus to next element on "arrow-right" keydown', () => {
      list.orientation = 'horizontal';
      arrowRight(list);
      expect(list.items[1].focused).to.be.true;
    });

    it('should move focus to prev element on "arrow-right" keydown', () => {
      list.orientation = 'horizontal';
      arrowRight(list);
      arrowLeft(list);
      expect(list.items[0].focused).to.be.true;
    });

    it('should move focus to first element on "home" keydown', () => {
      list._focus(3);
      home(list);
      expect(list.items[0].focused).to.be.true;
    });

    it('should move focus to second element if first is disabled on "home" keydown', () => {
      list.items[0].disabled = true;
      list._focus(3);
      home(list);
      expect(list.items[1].focused).to.be.true;
    });

    it('should move focus to last element on "end" keydown', () => {
      end(list);
      expect(list.items[6].focused).to.be.true;
    });

    it('should move focus to the most closed enabled element if last is disabled on "end" keydown', () => {
      list.items[6].disabled = true;
      end(list);
      expect(list.items[5].focused).to.be.true;
    });

    it('if focus is in last element should move focus to first element on arrow-down', () => {
      list._focus(list.items.length - 1);
      arrowDown(list);
      expect(list.items[0].focused).to.be.true;
    });

    it('if focus is in first element should move focus to last element on arrow-up', () => {
      arrowUp(list);
      expect(list.items[list.items.length - 1].focused).to.be.true;
    });

    it('focus loop should skip disabled items', () => {
      arrowDown(list);
      arrowDown(list);
      expect(list.items[3].focused).to.be.true;
    });

    it('should not focus anything when no matches are found', () => {
      keyDownChar(list, 'z');
      expect(list.items[0].focused).to.be.true;
      list._focus(1);
      keyDownChar(list, 'z');
      expect(list.items[1].focused).to.be.true;
    });

    it('should focus the next item whose first letters match the keys pressed', () => {
      keyDownChar(list, 'b');
      keyDownChar(list, 'a');
      keyDownChar(list, 'x');
      expect(list.items[6].focused).to.be.true;
    });

    it('should reset search buffer after 500ms without any key presses', async () => {
      const clock = sinon.useFakeTimers();
      keyDownChar(list, 'b');
      keyDownChar(list, 'a');
      await clock.tickAsync(500);
      keyDownChar(list, 'x');
      expect(list.items[5].focused).to.be.true;
      clock.restore();
    });

    it('key search should cycle through items starting with the same letters', () => {
      keyDownChar(list, 'b');
      keyDownChar(list, 'a');
      keyDownChar(list, 'b');
      keyDownChar(list, 'a');
      expect(list.items[3].focused).to.be.true;
    });

    it('key search should be case insensitive', () => {
      keyDownChar(list, 'B');
      expect(list.items[1].focused).to.be.true;
    });

    it('key search should happen if a modifier key is pressed', () => {
      keyDownChar(list, 'b', 'shift');
      expect(list.items[1].focused).to.be.true;
    });

    it('key search should skip disabled items', () => {
      keyDownChar(list, 'b');
      keyDownChar(list, 'b');
      expect(list.items[3].focused).to.be.true;
    });

    it('key search should accept items having non-text content before text', () => {
      keyDownChar(list, 'x');
      expect(list.items[5].focused).to.be.true;
    });

    it('focus should loop when search by first letter', () => {
      list._focus(list.items.length - 1);
      keyDownChar(list, 'b');
      expect(list.items[1].focused).to.be.true;
    });

    it('should not throw when there are no items', () => {
      list.innerHTML = '';
      list._setItems([]);
      expect(() => {
        list.focus();
      }).not.to.throw();
    });

    it('should not throw when items is not defined', () => {
      const listElement = document.createElement('test-list-element');
      expect(() => listElement.focus()).not.to.throw(Error);
    });
  });

  describe('orientation', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element>
          <test-item-element>Item 0</test-item-element>
          <test-item-element>Item 1</test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
    });

    it('if not orientation set, aria-orientation attribute should set to vertical', () => {
      expect(list.getAttribute('aria-orientation')).to.be.equal('vertical');
    });

    it('if horizontally oriented, aria-orientation attribute should be set to horizontal', () => {
      list.orientation = 'horizontal';
      expect(list.getAttribute('aria-orientation')).to.be.equal('horizontal');
    });

    it('if vertically oriented, aria-orientation attribute should be set to vertical', () => {
      list.orientation = 'vertical';
      expect(list.getAttribute('aria-orientation')).to.be.equal('vertical');
    });

    it('should not have orientation attribute on each item if orientation is not set', () => {
      list.querySelectorAll('test-item-element').forEach((item) => {
        expect(item.hasAttribute('orientation')).to.be.false;
      });
    });

    it('should have orientation attribute on each item', () => {
      list.orientation = 'horizontal';
      list.querySelectorAll('test-item-element').forEach((item) => {
        expect(item.getAttribute('orientation')).to.be.equal('horizontal');
      });
    });

    it('should change orientation attribute on each item', () => {
      list.orientation = 'horizontal';
      list.orientation = 'vertical';
      list.querySelectorAll('test-item-element').forEach((item) => {
        expect(item.getAttribute('orientation')).to.be.equal('vertical');
      });
    });

    it('should have vertical attribute on newly added item', async () => {
      list.orientation = 'vertical';

      const item = document.createElement('test-item-element');
      item.textContent = 'foo';
      list.appendChild(item);
      await nextFrame();
      expect(item.hasAttribute('orientation')).to.be.true;
    });

    it('should have a protected boolean property to check vertical orientation', () => {
      expect(list._vertical).to.be.true;
      list.orientation = 'horizontal';
      expect(list._vertical).to.be.false;
    });
  });

  describe('Scroll', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element style="width: 50px; height: 50px;">
          <test-item-element>Foo</test-item-element>
          <test-item-element>Bar</test-item-element>
          <test-item-element disabled>Bay</test-item-element>
          <test-item-element>Baz</test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
    });

    it('when orientation is horizontal should scroll in advance when reaching right most visible item', () => {
      list.orientation = 'horizontal';
      list._focus(0);
      arrowRight(list);

      const itemRectRight = list.items[2].getBoundingClientRect().right;
      const listRectRight = list.getBoundingClientRect().right;

      expect(listRectRight).to.be.closeTo(itemRectRight, 1);
    });

    it('when orientation is horizontal should scroll in advance when reaching left most visible item', () => {
      list.orientation = 'horizontal';
      list._focus(3);
      arrowLeft(list);

      const itemRectLeft = list.items[0].getBoundingClientRect().left;
      const listRectLeft = list.getBoundingClientRect().left;

      expect(listRectLeft).to.be.closeTo(itemRectLeft, 1);
    });

    it('when orientation is horizontal should move scroll horizontally', () => {
      list.orientation = 'horizontal';
      expect(list._scrollerElement.scrollLeft).to.be.equal(0);
      list._scrollToItem(1);
      expect(list._scrollerElement.scrollLeft).to.be.greaterThan(0);
    });

    it('when orientation is vertical should move scroll vertically', () => {
      list.orientation = 'vertical';
      expect(list._scrollerElement.scrollTop).to.be.equal(0);

      list._scrollToItem(1);

      expect(list._scrollerElement.scrollTop).to.be.greaterThan(0);
    });

    describe('RTL mode', () => {
      beforeEach(() => {
        list.orientation = 'horizontal';
        list.setAttribute('dir', 'rtl');
      });

      it('should scroll in advance when reaching left most visible item', () => {
        list._focus(0);
        arrowLeft(list);

        const itemRectLeft = list.items[2].getBoundingClientRect().left;
        const listRectLeft = list.getBoundingClientRect().left;

        expect(listRectLeft).to.be.closeTo(itemRectLeft, 1);
      });

      it('should scroll in advance when reaching right most visible item', () => {
        list._focus(3);
        arrowRight(list);

        const itemRectRight = list.items[0].getBoundingClientRect().right;
        const listRectRight = list.getBoundingClientRect().right;

        expect(listRectRight).to.be.closeTo(itemRectRight, 1);
      });
    });
  });

  describe('disabled', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element>
          <test-item-element>Item 0</test-item-element>
          <test-item-element>Item 1</test-item-element>
          <test-item-element>Item 2</test-item-element>
          <test-item-element>Item 3</test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
    });

    it('when list and items are disabled the previously selected item should be selected after enabling the list', () => {
      list.selected = 3;
      expect(list.items[3].selected).to.be.true;

      list.disabled = true;
      list.items.forEach((item) => (item.disabled = true));
      expect(list.items[3].selected).to.be.false;

      list.disabled = false;
      expect(list.items[3].selected).to.be.true;
    });
  });

  describe('multiple', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element>
          <test-item-element>Item 0</test-item-element>
          <test-item-element>Item 1</test-item-element>
          <test-item-element>Item 2</test-item-element>
          <test-item-element>Item 3</test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
    });

    it('should clear selected when multiple=true', () => {
      list.selected = 3;
      list.multiple = true;
      expect(list.selected).to.be.equal(undefined);
    });

    it('should move selected to selectedValues when multiple=true', () => {
      list.selected = 3;
      list.multiple = true;
      expect(list.selectedValues).to.eql([3]);
    });

    it('should clear selectedValues when multiple=false', () => {
      list.multiple = true;
      list.selectedValues = [3];
      list.multiple = false;
      expect(list.selectedValues).to.eql([]);
    });

    it('should reset selected items when multiple=false', () => {
      list.multiple = true;
      list.selectedValues = [1, 3];
      list.multiple = false;
      expect(list.items.filter((item) => item.selected).length).to.eql(0);
    });

    it('should set selectedValues when clicking item', () => {
      list.multiple = true;
      list.items[3].click();
      expect(list.selected).to.be.equal(undefined);
      expect(list.selectedValues).to.eql([3]);
    });

    it('should set selected when clicking item and multiple=false', () => {
      list.items[3].click();
      expect(list.selected).to.be.equal(3);
      expect(list.selectedValues).to.eql([]);
    });

    it('should add item to the selectedValues when clicking', () => {
      list.multiple = true;
      list.items[1].click();
      expect(list.selectedValues).to.eql([1]);
      expect(list.items[1].selected).to.be.true;
      list.items[3].click();
      expect(list.selectedValues).to.eql([1, 3]);
      expect(list.items[3].selected).to.be.true;
    });

    it('should remove item from the selectedValues when clicking', () => {
      list.multiple = true;
      list.selectedValues = [1, 3];
      list.items[1].click();
      expect(list.selectedValues).to.eql([3]);
      expect(list.items[1].selected).to.be.false;
      list.items[3].click();
      expect(list.selectedValues).to.eql([]);
      expect(list.items[3].selected).to.be.false;
    });

    it('should fire one selected-values-changed event', () => {
      list.multiple = true;
      const spy = sinon.spy();
      list.addEventListener('selected-values-changed', spy);
      list.items[3].click();
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.value).to.eql([3]);
    });

    it('when orientation is horizontal should move scroll horizontally on item selection', () => {
      list.multiple = true;
      list.style.width = '50px';
      list.orientation = 'horizontal';
      expect(list._scrollerElement.scrollLeft).to.be.equal(0);

      list.items[3].click();
      expect(list._scrollerElement.scrollLeft).to.be.greaterThan(0);
    });

    it('when orientation is vertical should move scroll vertically on item selection', () => {
      list.multiple = true;
      list.style.display = 'flex';
      list.style.height = '50px';
      list.orientation = 'vertical';
      expect(list._scrollerElement.scrollTop).to.be.equal(0);

      list.items[3].click();
      expect(list._scrollerElement.scrollTop).to.be.greaterThan(0);
    });
  });

  describe('hidden items', () => {
    beforeEach(() => {
      list = fixtureSync(`
        <test-list-element style="width: 400px; height: 400px;">
          <test-item-element>Foo</test-item-element>
          <test-item-element hidden>Bar</test-item-element>
          <test-item-element>Bax</test-item-element>
          <test-item-element style="display: none;">Bay</test-item-element>
          <test-item-element>Fox</test-item-element>
          <test-item-element class="hidden-attribute">Pub</test-item-element>
          <test-item-element>Bin</test-item-element>
          <test-item-element style="display: none;">Bop</test-item-element>
        </test-list-element>
      `);
      list._observer.flush();
      list._focus(0);
    });

    it('should move focus to next not hidden element on "arrow-down"', () => {
      expect(list.items[0].focused).to.be.true;
      expect(getComputedStyle(list.items[0]).getPropertyValue('display')).to.equal('block');
      arrowDown(list);
      expect(getComputedStyle(list.items[1]).getPropertyValue('display')).to.equal('none');
      expect(list.items.filter((item) => item.textContent === 'Bax')[0].focused).to.be.true;
    });

    it('should move focus to next not hidden element on "arrow-up"', () => {
      expect(list.items[0].focused).to.be.true;
      expect(getComputedStyle(list.items[0]).getPropertyValue('display')).to.equal('block');
      arrowUp(list);
      expect(getComputedStyle(list.items[list.items.length - 1]).getPropertyValue('display')).to.equal('none');
      expect(list.items.filter((item) => item.textContent === 'Bin')[0].focused).to.be.true;
    });

    it('should not set tabIndex=0 to hidden items, but the next one in the loop', () => {
      arrowDown(list);
      [-1, -1, 0].forEach((val, idx) => expect(list.items[idx].tabIndex).to.be.equal(val));
    });

    it('should skip hidden items to key search', () => {
      keyDownChar(list, 'b');
      keyDownChar(list, 'b');
      expect(list.items.filter((item) => item.textContent === 'Bin')[0].focused).to.be.true;
    });

    it('should skip hidden items to focus loop', () => {
      arrowDown(list);
      arrowDown(list);
      expect(list.items.filter((item) => item.textContent === 'Fox')[0].focused).to.be.true;
    });
  });

  describe('_scrollerElement missing', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn when creating an element without focusElement', () => {
      class ScrollerElementMissing extends ListMixin(PolymerElement) {}
      customElements.define('scroller-element-missing', ScrollerElementMissing);
      const instance = document.createElement('scroller-element-missing');
      expect(instance._scrollerElement).to.equal(instance);
      expect(console.warn.calledOnce).to.be.true;
    });
  });
});
