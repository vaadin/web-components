import { expect } from '@esm-bundle/chai';
import {
  arrowDownKeyDown,
  arrowLeftKeyDown,
  arrowRightKeyDown,
  arrowUpKeyDown,
  endKeyDown,
  fixtureSync,
  homeKeyDown,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KeyboardDirectionMixin } from '../src/keyboard-direction-mixin.js';

customElements.define(
  'keyboard-direction-mixin-element',
  class extends KeyboardDirectionMixin(PolymerElement) {
    static get template() {
      return html`
        <style>
          ::slotted(.hidden) {
            display: none;
          }

          :host(:not([vertical])) {
            display: flex;
          }
        </style>
        <slot></slot>
      `;
    }

    get _vertical() {
      return this.hasAttribute('vertical');
    }
  },
);

describe('keyboard-direction-mixin', () => {
  let element, items;

  beforeEach(() => {
    element = fixtureSync(`
      <keyboard-direction-mixin-element>
        <div tabindex="0">Foo</div>
        <div tabindex="0">Bar</div>
        <div disabled>Baz</div>
        <div tabindex="0">Qux</div>
        <div tabindex="0">Xyz</div>
        <div tabindex="0">Abc</div>
      </keyboard-direction-mixin-element>
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

        it('should move focus to prev element on "arrow-right" keydown in LTR', () => {
          arrowRightKeyDown(items[0]);
          arrowLeftKeyDown(items[1]);
          expect(element.focused).to.be.equal(items[0]);
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

      it('should set focus-ring on the focused element on keydown', () => {
        arrowDownKeyDown(items[0]);
        expect(items[1].hasAttribute('focus-ring')).to.be.true;
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
});
