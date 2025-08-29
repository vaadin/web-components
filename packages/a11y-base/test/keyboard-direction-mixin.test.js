import { expect } from '@vaadin/chai-plugins';
import {
  arrowDownKeyDown,
  arrowLeftKeyDown,
  arrowRightKeyDown,
  arrowUpKeyDown,
  defineLit,
  endKeyDown,
  fixtureSync,
  homeKeyDown,
  tabKeyDown,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { KeyboardDirectionMixin } from '../src/keyboard-direction-mixin.js';

describe('KeyboardDirectionMixin', () => {
  const tag = defineLit(
    'keyboard-direction-mixin',
    `
      <style>
        ::slotted(.hidden) {
          display: none;
        }

        :host(:not([vertical])) {
          display: flex;
        }
      </style>
      <slot></slot>
    `,
    (Base) =>
      class extends KeyboardDirectionMixin(PolylitMixin(Base)) {
        get _vertical() {
          return this.hasAttribute('vertical');
        }

        get _tabNavigation() {
          return this.hasAttribute('tab-navigation');
        }
      },
  );

  let element, items;

  beforeEach(() => {
    element = fixtureSync(`
      <${tag}>
        <div tabindex="0">Foo</div>
        <div tabindex="0">Bar</div>
        <div disabled>Baz</div>
        <div tabindex="0">Qux</div>
        <div tabindex="0">Xyz</div>
        <div tabindex="0">Abc</div>
      </${tag}>
    `);
    items = element.children;
  });

  describe('focus', () => {
    it('should focus the first child element', () => {
      const spy = sinon.spy(items[0], 'focus');
      element.focus();
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus the first non-disabled element', () => {
      items[0].setAttribute('disabled', '');
      const spy = sinon.spy(items[1], 'focus');
      element.focus();
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus the first non-hidden element', () => {
      items[0].setAttribute('hidden', '');
      element.focus();
      expect(element.focused).to.be.equal(items[1]);
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(() => {
      element.focus();
    });

    describe('horizontal', () => {
      describe('LTR', () => {
        it('should move focus to next element on "arrow-right" keydown in LTR', () => {
          arrowRightKeyDown(items[0]);
          expect(element.focused).to.be.equal(items[1]);
        });

        it('should move focus to prev element on "arrow-left" keydown in LTR', () => {
          arrowRightKeyDown(items[0]);
          arrowLeftKeyDown(items[1]);
          expect(element.focused).to.be.equal(items[0]);
        });

        it('should move focus to last element on first element "arrow-left" keydown', () => {
          arrowLeftKeyDown(items[0]);
          expect(element.focused).to.equal(items[5]);
        });

        it('should move focus to first element on last element "arrow-right" keydown', () => {
          arrowLeftKeyDown(items[0]);
          arrowRightKeyDown(items[5]);
          expect(element.focused).to.equal(items[0]);
        });
      });

      describe('RTL', () => {
        beforeEach(() => {
          element.setAttribute('dir', 'rtl');
        });

        it('should move focus to next element on "arrow-left" keydown in RTL', () => {
          arrowLeftKeyDown(items[0]);
          expect(element.focused).to.be.equal(items[1]);
        });

        it('should move focus to prev element on "arrow-right" keydown in RTL', () => {
          arrowLeftKeyDown(items[0]);
          arrowRightKeyDown(items[1]);
          expect(element.focused).to.be.equal(items[0]);
        });

        it('should move focus to last element on first element "arrow-right" keydown', () => {
          arrowRightKeyDown(items[0]);
          expect(element.focused).to.equal(items[5]);
        });

        it('should move focus to first element on last element "arrow-left" keydown', () => {
          arrowRightKeyDown(items[0]);
          arrowLeftKeyDown(items[5]);
          expect(element.focused).to.equal(items[0]);
        });
      });
    });

    describe('vertical', () => {
      beforeEach(() => {
        element.setAttribute('vertical', '');
      });

      it('should move focus to next element on "arrow-down" keydown', () => {
        arrowDownKeyDown(items[0]);
        expect(element.focused).to.be.equal(items[1]);
      });

      it('should move focus to prev element on "arrow-up" keydown', () => {
        arrowDownKeyDown(items[0]);
        arrowUpKeyDown(items[1]);
        expect(element.focused).to.be.equal(items[0]);
      });

      it('should move focus to first element on "home" keydown', () => {
        arrowDownKeyDown(items[0]);
        homeKeyDown(items[1]);
        expect(element.focused).to.be.equal(items[0]);
      });

      it('should move focus to last element on "end" keydown', () => {
        endKeyDown(items[0]);
        expect(element.focused).to.be.equal(items[5]);
      });

      it('should focus the first non-disabled element on "home" keydown', () => {
        items[0].setAttribute('disabled', '');
        items[3].focus();
        homeKeyDown(items[3]);
        expect(element.focused).to.be.equal(items[1]);
      });

      it('should focus to the last non-disabled element on "end" keydown', () => {
        items[5].setAttribute('disabled', '');
        endKeyDown(items[0]);
        expect(element.focused).to.be.equal(items[4]);
      });

      it('should not move focus on keydown with Ctrl key modifier', () => {
        const spy = sinon.spy(items[1], 'focus');
        arrowDownKeyDown(items[0], ['ctrl']);
        expect(spy.called).to.be.false;
      });

      it('should not move focus on keydown with Meta key modifier', () => {
        const spy = sinon.spy(items[1], 'focus');
        arrowDownKeyDown(items[0], ['meta']);
        expect(spy.called).to.be.false;
      });
    });

    describe('hidden items', () => {
      it('should skip element hidden using attribute', () => {
        items[1].setAttribute('hidden', '');
        arrowRightKeyDown(items[0]);
        expect(element.focused).to.be.equal(items[3]);
      });

      it('should skip element hidden with using CSS class', () => {
        items[1].classList.add('hidden');
        arrowRightKeyDown(items[0]);
        expect(element.focused).to.be.equal(items[3]);
      });

      it('should skip element hidden with using inline style', () => {
        items[1].style.display = 'none';
        arrowRightKeyDown(items[0]);
        expect(element.focused).to.be.equal(items[3]);
      });
    });
  });

  describe('Tab navigation', () => {
    beforeEach(() => {
      element.setAttribute('tab-navigation', '');
      element.focus();
    });

    it('should move focus to next element on Tab keydown', () => {
      tabKeyDown(items[0]);
      expect(element.focused).to.be.equal(items[1]);
    });

    it('should move focus to prev element on Shift + Tab keydown', () => {
      tabKeyDown(items[0]);
      tabKeyDown(items[1], ['shift']);
      expect(element.focused).to.be.equal(items[0]);
    });

    it('should not move focus to last element on first element Shift + Tab keydown', () => {
      tabKeyDown(items[0], ['shift']);
      expect(element.focused).to.not.equal(items[5]);
    });

    it('should not move focus to first element on last element Tab keydown', () => {
      items[5].focus();
      tabKeyDown(items[5]);
      expect(element.focused).to.not.equal(items[0]);
    });
  });
});
