import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import '../vaadin-tabs.js';

describe('scrollable tabs', () => {
  let tabs, items, scroller;

  function arrowDown(target) {
    keyDownOn(target, 40, [], 'ArrowDown');
  }

  function arrowRight(target) {
    keyDownOn(target, 39, [], 'ArrowRight');
  }

  function arrowUp(target) {
    keyDownOn(target, 38, [], 'ArrowUp');
  }

  function arrowLeft(target) {
    keyDownOn(target, 37, [], 'ArrowLeft');
  }

  beforeEach(() => {
    tabs = fixtureSync(`
      <vaadin-tabs style="width: 400px; height: 150px;">
        <vaadin-tab>Foo</vaadin-tab>
        <vaadin-tab>Bar</vaadin-tab>
        <separator>___</separator>
        <vaadin-tab disabled>Baz</vaadin-tab>
        <vaadin-tab>Foo1</vaadin-tab>
        <vaadin-tab>Bar1</vaadin-tab>
        <vaadin-tab>Baz1</vaadin-tab>
        <vaadin-tab>Foo2</vaadin-tab>
        <vaadin-tab>Bar2</vaadin-tab>
      </vaadin-tabs>
    `);
    tabs._observer.flush();
    items = tabs.items;
    scroller = tabs.shadowRoot.querySelector('[part="tabs"]');
  });

  describe('horizontal', () => {
    beforeEach(() => {
      tabs.orientation = 'horizontal';
    });

    it('should show one extra item on the right edge of the viewport on "arrow-right" on last visible tab', () => {
      tabs.selected = 5;
      tabs._focus(5);
      // Check the scroller is not scrolled vertically
      arrowRight(tabs);
      expect(scroller.getBoundingClientRect().right).to.be.closeTo(items[7].getBoundingClientRect().right, 1);
    });

    it('should show one extra item on the left edge of the viewport on "arrow-left" on first visible tab', () => {
      // Move scroller so the first tab will be out of visible part
      tabs.selected = 7;
      tabs._focus(7);
      // Check the scroller is not scrolled vertically
      expect(scroller.scrollTop).to.be.equal(0);
      // Move focus and choose the first visible tab selected
      items[2].disabled = false;
      tabs.selected = 2;
      tabs._focus(2);

      arrowLeft(tabs);
      expect(scroller.getBoundingClientRect().left).to.be.closeTo(items[0].getBoundingClientRect().left, 1);
    });

    it('should scroll forward when arrow button is clicked', () => {
      const btn = tabs.shadowRoot.querySelector('[part="forward-button"]');
      btn.click();
      expect(scroller.scrollLeft).to.be.closeTo(scroller.scrollWidth - scroller.offsetWidth, 1);
    });

    it('should scroll back when arrow button is clicked', () => {
      tabs.selected = 4;
      const btn = tabs.shadowRoot.querySelector('[part="back-button"]');
      btn.click();
      expect(scroller.scrollLeft).to.be.equal(0);
    });
  });

  describe('vertical', () => {
    beforeEach(() => {
      tabs.orientation = 'vertical';
      tabs._updateOverflow();
    });

    it('should move the scroll vertically to display selected item', () => {
      expect(scroller.scrollTop).to.be.equal(0);
      tabs.selected = 5;
      tabs._focus(5);
      expect(scroller.scrollTop).to.be.greaterThan(0);
    });

    it('should show one extra item on the bottom edge of the viewport on "arrow-down" on last visible tab', () => {
      tabs.selected = 5;
      tabs._focus(5);

      const scrollPosition = items[7].getBoundingClientRect().bottom;
      arrowDown(tabs);
      expect(items[7].getBoundingClientRect().bottom).to.be.lessThan(scrollPosition);
    });

    it('should show one extra item on the top edge of the viewport on "arrow-up" on first visible tab', () => {
      items[2].disabled = false;
      tabs.selected = 7;
      tabs._focus(7);

      tabs.selected = 2;
      tabs._focus(2);

      const scrollPosition = items[7].getBoundingClientRect().bottom;
      arrowUp(tabs);
      expect(items[7].getBoundingClientRect().bottom).to.be.greaterThan(scrollPosition);
    });
  });
});
