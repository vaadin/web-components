import { expect } from '@esm-bundle/chai';
import {
  arrowDown,
  arrowLeft,
  arrowRight,
  arrowUp,
  defineLit,
  definePolymer,
  end,
  fixtureSync,
  home,
  keyDownChar,
  nextFrame,
  nextRender,
  oneEvent,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '../src/controller-mixin.js';
import { ListMixin } from '../src/list-mixin.js';
import { PolylitMixin } from '../src/polylit-mixin.js';

const runTests = (defineHelper, baseMixin) => {
  let list;

  const listTag = defineHelper(
    'list',
    `
      <style>
        :host {
          display: block;
        }

        #scroll {
          overflow: auto;
          display: flex;
        }

        :host(:not([orientation="horizontal"])) #scroll {
          height: 100%;
          flex-direction: column;
        }
      </style>
      <div id="scroll">
        <slot></slot>
      </div>
    `,
    (Base) =>
      class extends ListMixin(baseMixin(Base)) {
        get _scrollerElement() {
          return this.$.scroll;
        }
      },
  );

  const itemTag = defineHelper(
    'item',
    `
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
    `,
    (Base) =>
      class extends baseMixin(Base) {
        static get properties() {
          return {
            disabled: {
              type: Boolean,
              reflectToAttribute: true,
              observer: '_disabledChanged',
            },
            focused: {
              type: Boolean,
            },
            selected: {
              type: Boolean,
            },
          };
        }

        constructor() {
          super();

          this._hasVaadinItemMixin = true;
        }

        _disabledChanged(disabled) {
          if (disabled) {
            // Mimic the ItemMixin logic
            this.selected = false;
          }
        }
      },
  );

  describe('items', () => {
    beforeEach(async () => {
      list = fixtureSync(`
        <${listTag}>
          <${itemTag}>Item 0</${itemTag}>
          <${itemTag}>Item 1</${itemTag}>
          <hr />
          <${itemTag}>Item 2</${itemTag}>
          <${itemTag}>Item 3</${itemTag}>
          <hr />
          <${itemTag}>Item 4</${itemTag}>
        </${listTag}>
      `);
      await nextRender();
    });

    it('should set items based on the children count', () => {
      expect(list.items.length).to.be.equal(5);
    });

    it('should update items when an element is added', async () => {
      list.appendChild(document.createElement(itemTag));
      await nextFrame();
      expect(list.items.length).to.be.equal(6);
    });

    it('should update items when an element is removed', async () => {
      list.removeChild(list.items[0]);
      await nextFrame();
      expect(list.items.length).to.be.equal(4);
    });

    it('should update items when an element is moved', async () => {
      const [e2, e4] = [list.items[2], list.items[4]];
      list.insertBefore(e4, e2);
      await nextFrame();
      expect(list.items[2]).to.be.equal(e4);
      expect(list.items[3]).to.be.equal(e2);
    });

    it('should fire an event when adding an item', async () => {
      const spy = sinon.spy();
      list.addEventListener('items-changed', spy);
      list.appendChild(document.createElement(itemTag));
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire an event when removing an item', async () => {
      const spy = sinon.spy();
      list.addEventListener('items-changed', spy);
      list.removeChild(list.items[0]);
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should update items synchronously on `focus()`', () => {
      list.appendChild(document.createElement(itemTag));
      list.focus();
      expect(list.items.length).to.be.equal(6);
    });
  });

  describe('wrapped list with slotted items', () => {
    let wrapper;

    beforeEach(async () => {
      wrapper = document.createElement('div');
      document.body.appendChild(wrapper);

      const root = wrapper.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <${listTag}>
          <slot></slot>
        </${listTag}>
      `;

      wrapper.innerHTML = `
        <${itemTag}>Item 0</${itemTag}>
        <${itemTag}>Item 1</${itemTag}>
        <${itemTag}>Item 2</${itemTag}>
      `;

      list = wrapper.shadowRoot.querySelector(listTag);
      await oneEvent(list, 'items-changed');
    });

    afterEach(() => {
      document.body.removeChild(wrapper);
    });

    it('should set items based on the children count', () => {
      expect(list.items.length).to.be.equal(3);
    });

    it('should move focus to the next element on ArrowRight', async () => {
      list.orientation = 'horizontal';
      await nextFrame();
      list.focus();
      arrowRight(list);
      expect(list.items[1].focused).to.be.true;
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      list = fixtureSync(`
        <${listTag}>
          <${itemTag}>Item 0</${itemTag}>
          <${itemTag}>Item 1</${itemTag}>
          <${itemTag}>Item 2</${itemTag}>
          <${itemTag}><span>Item 3</span></${itemTag}>
        </${listTag}>
      `);
      await nextRender();
    });

    it('should not select any item by default', () => {
      list.items.forEach((item) => {
        expect(item.selected).to.be.false;
      });
    });

    it('should select an item when `selected` property is set', async () => {
      list.selected = 3;
      await nextFrame();
      expect(list.items[3].selected).to.be.true;
    });

    it('should clear selection when `selected` property is set to not numeric value', async () => {
      list.selected = 3;
      await nextFrame();

      list.selected = undefined;
      await nextFrame();
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
    beforeEach(async () => {
      list = fixtureSync(`
        <${listTag}>
          <${itemTag} disabled>Item 0</${itemTag}>
          <${itemTag} disabled>Item 1</${itemTag}>
          <${itemTag}>Item 2</${itemTag}>
          <${itemTag}>Item 3</${itemTag}>
        </${listTag}>
      `);
      await nextRender();
    });

    it('should have the first not disabled item focusable by default', () => {
      [-1, -1, 0, -1].forEach((val, idx) => expect(list.items[idx].tabIndex).to.equal(val));
    });

    it('should set a not disabled item focusable', async () => {
      list._setFocusable(3);
      await nextFrame();
      [-1, -1, -1, 0].forEach((val, idx) => expect(list.items[idx].tabIndex).to.equal(val));
    });

    it('should not set a disabled item focusable but the next not disabled item instead', async () => {
      list._setFocusable(1);
      await nextFrame();
      [-1, -1, 0, -1].forEach((val, idx) => expect(list.items[idx].tabIndex).to.equal(val));
    });

    it('should call focus() method on the item when setting it focusable', async () => {
      list._setFocusable(3);
      await nextFrame();
      const spy = sinon.spy(list.items[3], 'focus');
      list.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('tabIndex when all the items are disabled', () => {
    beforeEach(async () => {
      list = fixtureSync(`
        <${listTag}>
          <${itemTag} disabled>Item 0</${itemTag}>
          <${itemTag} disabled>Item 1</${itemTag}>
        </${listTag}>
      `);
      await nextRender();
    });

    it('should not have any item focusable', () => {
      expect(list.items[0].tabIndex).to.equal(-1);
      expect(list.items[1].tabIndex).to.equal(-1);
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      list = fixtureSync(`
        <${listTag}>
          <${itemTag}>Foo</${itemTag}>
          <${itemTag}>Bar</${itemTag}>
          <${itemTag} disabled>Bay</${itemTag}>
          <${itemTag}><span>Baz</span></${itemTag}>
          <${itemTag} disabled>Qux</${itemTag}>
          <${itemTag}><span>Xyzzy</span></${itemTag}>
          <${itemTag}>Bax</${itemTag}>
        </${listTag}>
      `);
      await nextRender();
      list.focus();
    });

    describe('horizontal', () => {
      beforeEach(async () => {
        list.orientation = 'horizontal';
        await nextFrame();
      });

      describe('LTR mode', () => {
        it('should move focus to the next element on ArrowRight', () => {
          arrowRight(list);
          expect(list.items[1].focused).to.be.true;
        });

        it('should move focus to the prev element on ArrowLeft', () => {
          arrowRight(list);
          arrowLeft(list);
          expect(list.items[0].focused).to.be.true;
        });

        it('should move focus to the first element on Home', () => {
          home(list);
          expect(list.items[0].focused).to.be.true;
        });

        it('should move focus to the last element on End', async () => {
          list._focus(3);
          await nextFrame();

          end(list);
          expect(list.items[6].focused).to.be.true;
        });
      });

      describe('RTL mode', () => {
        beforeEach(async () => {
          list.orientation = 'horizontal';
          list.setAttribute('dir', 'rtl');
          await nextFrame();
        });

        it('should move focus to the next element on ArrowLeft', () => {
          arrowLeft(list);
          expect(list.items[1].focused).to.be.true;
        });

        it('should move focus to the prev element on ArrowRight', () => {
          arrowLeft(list);
          arrowRight(list);
          expect(list.items[0].focused).to.be.true;
        });

        it('should move focus to the first element on Home', () => {
          home(list);
          expect(list.items[0].focused).to.be.true;
        });

        it('should move focus to the last element on End', async () => {
          list._focus(3);
          await nextFrame();
          end(list);
          expect(list.items[6].focused).to.be.true;
        });
      });
    });

    describe('vertical', () => {
      beforeEach(async () => {
        list.orientation = 'vertical';
        await nextFrame();
      });

      it('should move focus to the next element on ArrowDown', () => {
        arrowDown(list);
        expect(list.items[1].focused).to.be.true;
      });

      it('should move focus to the prev element on ArrowUp', () => {
        arrowDown(list);
        arrowUp(list);
        expect(list.items[0].focused).to.be.true;
      });

      it('should move focus to the first element on Home', async () => {
        list._focus(3);
        await nextFrame();
        home(list);
        expect(list.items[0].focused).to.be.true;
      });

      it('should skip disabled items when moving focus on Home', async () => {
        list.items[0].disabled = true;
        await nextFrame();

        list._focus(3);
        home(list);
        expect(list.items[1].focused).to.be.true;
      });

      it('should move focus to the last element on End', () => {
        end(list);
        expect(list.items[6].focused).to.be.true;
      });

      it('should skip disabled items when moving focus on End', async () => {
        list.items[6].disabled = true;
        await nextFrame();
        end(list);
        expect(list.items[5].focused).to.be.true;
      });

      it('should move focus to the first element on last element ArrowDown', () => {
        list._focus(list.items.length - 1);
        arrowDown(list);
        expect(list.items[0].focused).to.be.true;
      });

      it('should move focus to the last element on first element ArrowUp', () => {
        arrowUp(list);
        expect(list.items[list.items.length - 1].focused).to.be.true;
      });

      it('should skip disabled items when moving focus on arrow key', () => {
        arrowDown(list);
        arrowDown(list);
        expect(list.items[3].focused).to.be.true;
      });
    });

    describe('character navigation', () => {
      beforeEach(() => {
        list._focus(0);
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
    });

    describe('empty items', () => {
      it('should not throw on focus after removing all the items', async () => {
        list.innerHTML = '';
        await nextRender();
        expect(() => {
          list.focus();
        }).not.to.throw();
      });

      it('should not throw on focus when there are no items', () => {
        const listElement = document.createElement(listTag);
        expect(() => listElement.focus()).not.to.throw(Error);
      });
    });
  });

  describe('orientation', () => {
    beforeEach(async () => {
      list = fixtureSync(`
        <${listTag}>
          <${itemTag}>Item 0</${itemTag}>
          <${itemTag}>Item 1</${itemTag}>
        </${listTag}>
      `);
      await nextRender();
    });

    it('should set aria-orientation attribute to vertical by default', () => {
      expect(list.getAttribute('aria-orientation')).to.be.equal('vertical');
    });

    it('should set aria-orientation attribute to horizontal when orientation is set', async () => {
      list.orientation = 'horizontal';
      await nextFrame();
      expect(list.getAttribute('aria-orientation')).to.be.equal('horizontal');
    });

    it('should set aria-orientation attribute to horizontal when orientation is set', async () => {
      list.orientation = 'vertical';
      await nextFrame();
      expect(list.getAttribute('aria-orientation')).to.be.equal('vertical');
    });

    it('should not have orientation attribute on each item if orientation is not set', () => {
      list.querySelectorAll(itemTag).forEach((item) => {
        expect(item.hasAttribute('orientation')).to.be.false;
      });
    });

    it('should have orientation attribute on each item', async () => {
      list.orientation = 'horizontal';
      await nextFrame();
      list.querySelectorAll(itemTag).forEach((item) => {
        expect(item.getAttribute('orientation')).to.be.equal('horizontal');
      });
    });

    it('should change orientation attribute on each item', async () => {
      list.orientation = 'horizontal';
      await nextFrame();

      list.orientation = 'vertical';
      await nextFrame();

      list.querySelectorAll(itemTag).forEach((item) => {
        expect(item.getAttribute('orientation')).to.be.equal('vertical');
      });
    });

    it('should have vertical attribute on newly added item', async () => {
      list.orientation = 'vertical';
      await nextFrame();

      const item = document.createElement(itemTag);
      item.textContent = 'foo';
      list.appendChild(item);
      await nextFrame();
      expect(item.hasAttribute('orientation')).to.be.true;
    });

    it('should have a protected boolean property to check vertical orientation', async () => {
      expect(list._vertical).to.be.true;
      list.orientation = 'horizontal';
      await nextFrame();
      expect(list._vertical).to.be.false;
    });
  });

  describe('scroll', () => {
    beforeEach(async () => {
      list = fixtureSync(`
        <${listTag} style="width: 50px; height: 50px;">
          <${itemTag}>Foo</${itemTag}>
          <${itemTag}>Bar</${itemTag}>
          <${itemTag} disabled>Bay</${itemTag}>
          <${itemTag}>Baz</${itemTag}>
        </${listTag}>
      `);
      await nextRender();
    });

    describe('basic', () => {
      it('should update scrollLeft when scrolling to item horizontally', async () => {
        list.orientation = 'horizontal';
        await nextFrame();

        expect(list._scrollerElement.scrollLeft).to.be.equal(0);

        list._scrollToItem(1);
        expect(list._scrollerElement.scrollLeft).to.be.greaterThan(0);
      });

      it('should update scrollTop when scrolling to item vertically', async () => {
        list.orientation = 'vertical';
        await nextFrame();

        expect(list._scrollerElement.scrollTop).to.be.equal(0);

        list._scrollToItem(1);
        expect(list._scrollerElement.scrollTop).to.be.greaterThan(0);
      });
    });

    describe('scroll in advance', () => {
      beforeEach(async () => {
        list.orientation = 'horizontal';
        await nextFrame();
      });

      describe('LTR scroll', () => {
        it('should scroll in advance when reaching right most visible item', () => {
          list._focus(0);
          arrowRight(list);

          const itemRectRight = list.items[2].getBoundingClientRect().right;
          const listRectRight = list.getBoundingClientRect().right;

          expect(listRectRight).to.be.closeTo(itemRectRight, 1);
        });

        it('should scroll in advance when reaching left most visible item', () => {
          list._focus(3);
          arrowLeft(list);

          const itemRectLeft = list.items[0].getBoundingClientRect().left;
          const listRectLeft = list.getBoundingClientRect().left;

          expect(listRectLeft).to.be.closeTo(itemRectLeft, 1);
        });
      });

      describe('RTL scroll', () => {
        beforeEach(async () => {
          list.setAttribute('dir', 'rtl');
          await nextFrame();
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
  });

  describe('disabled', () => {
    beforeEach(async () => {
      list = fixtureSync(`
        <${listTag}>
          <${itemTag}>Item 0</${itemTag}>
          <${itemTag}>Item 1</${itemTag}>
          <${itemTag}>Item 2</${itemTag}>
          <${itemTag}>Item 3</${itemTag}>
        </${listTag}>
      `);
      await nextRender();
    });

    it('should reset previously selected item when listbox and items are disabled', async () => {
      list.selected = 3;
      await nextFrame();
      expect(list.items[3].selected).to.be.true;

      list.disabled = true;
      list.children.forEach((item) => {
        item.disabled = true;
      });
      await nextFrame();

      expect(list.items[3].selected).to.be.false;
    });

    it('should restore previously selected item when listbox becomes re-enabled', async () => {
      list.selected = 3;
      await nextFrame();

      list.disabled = true;
      list.children.forEach((item) => {
        item.disabled = true;
      });
      await nextFrame();

      list.disabled = false;
      await nextFrame();

      expect(list.items[3].selected).to.be.true;
    });
  });

  describe('hidden items', () => {
    beforeEach(async () => {
      list = fixtureSync(`
        <${listTag} style="width: 400px; height: 400px;">
          <${itemTag}>Foo</${itemTag}>
          <${itemTag} hidden>Bar</${itemTag}>
          <${itemTag}>Bax</${itemTag}>
          <${itemTag} style="display: none;">Bay</${itemTag}>
          <${itemTag}>Fox</${itemTag}>
          <${itemTag} class="hidden-attribute">Pub</${itemTag}>
          <${itemTag}>Bin</${itemTag}>
          <${itemTag} style="display: none;">Bop</${itemTag}>
        </${listTag}>
      `);
      await nextRender();
      list.focus();
    });

    it('should ship hidden items when moving focus on ArrowDown', () => {
      arrowDown(list);
      expect(list.items.find((item) => item.textContent === 'Bax').focused).to.be.true;
    });

    it('should skip hidden items when moving focus on ArrowUp', () => {
      arrowUp(list);
      expect(list.items.find((item) => item.textContent === 'Bin').focused).to.be.true;
    });

    it('should not set tabIndex=0 to hidden items, but the next one in the loop', () => {
      arrowDown(list);
      [-1, -1, 0].forEach((val, idx) => expect(list.items[idx].tabIndex).to.be.equal(val));
    });

    it('should skip hidden items to key search', () => {
      keyDownChar(list, 'b');
      keyDownChar(list, 'b');
      expect(list.items.find((item) => item.textContent === 'Bin').focused).to.be.true;
    });

    it('should skip hidden items to focus loop', () => {
      arrowDown(list);
      arrowDown(list);
      expect(list.items.find((item) => item.textContent === 'Fox').focused).to.be.true;
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
      const tag = defineHelper('no-scroller', '<slot></slot>', (Base) => class extends ListMixin(baseMixin(Base)) {});
      const instance = document.createElement(tag);
      expect(instance._scrollerElement).to.equal(instance);
      expect(console.warn.calledOnce).to.be.true;
    });
  });
};

describe('ListMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('ListMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
