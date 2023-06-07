import { expect } from '@esm-bundle/chai';
import { arrowDown, arrowLeft, arrowRight, arrowUp, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-tabs.js';

describe('scrollable tabs', () => {
  let tabs, items, scroller;

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
        <vaadin-tab>Baz2</vaadin-tab>
        <vaadin-tab>Foo3</vaadin-tab>
        <vaadin-tab>Bar3</vaadin-tab>
        <vaadin-tab>Baz3</vaadin-tab>
        <vaadin-tab>Foo4</vaadin-tab>
        <vaadin-tab>Bar4</vaadin-tab>
        <vaadin-tab>Baz4</vaadin-tab>
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
      const initialScrollLeft = scroller.scrollLeft;
      const btn = tabs.shadowRoot.querySelector('[part="forward-button"]');
      btn.click();
      expect(scroller.scrollLeft).to.be.greaterThan(initialScrollLeft);
    });

    it('should scroll back when arrow button is clicked', () => {
      tabs.selected = 4;
      const btn = tabs.shadowRoot.querySelector('[part="back-button"]');
      btn.click();
      expect(scroller.scrollLeft).to.be.equal(0);
    });

    ['ltr', 'rtl'].forEach((dir) => {
      describe(dir, () => {
        beforeEach(async () => {
          tabs.setAttribute('dir', dir);
          await nextFrame();
        });

        it('should have displayed all the items fully when scrolled forward to the end via button', async () => {
          const forwardButton = tabs.shadowRoot.querySelector('[part="forward-button"]');

          expect(-tabs.__direction * tabs._scrollerElement.scrollLeft).to.equal(0);

          forwardButton.click();
          expect(-tabs.__direction * tabs._scrollerElement.scrollLeft).to.be.approximately(310, 5);

          forwardButton.click();
          expect(-tabs.__direction * tabs._scrollerElement.scrollLeft).to.be.approximately(537, 5);
        });

        it('should have displayed all the items fully when scrolled back to the start via button', async () => {
          // Initially scroll to the end
          tabs._scrollToItem(items.length - 1);

          const backButton = tabs.shadowRoot.querySelector('[part="back-button"]');

          expect(-tabs.__direction * tabs._scrollerElement.scrollLeft).to.be.approximately(537, 5);

          backButton.click();
          expect(-tabs.__direction * tabs._scrollerElement.scrollLeft).to.be.approximately(228, 5);

          backButton.click();
          expect(tabs._scrollerElement.scrollLeft).to.equal(0);
        });

        it('should not get stuck with wide tabs when scrolled forward to the end via button', async () => {
          tabs.style.width = '100px';

          const forwardButton = tabs.shadowRoot.querySelector('[part="forward-button"]');
          let previousScrollLeft;
          let currentScrollLeft = tabs._scrollerElement.scrollLeft;
          // Click the forward button until it does not have any effect
          do {
            previousScrollLeft = currentScrollLeft;
            forwardButton.click();
            currentScrollLeft = tabs._scrollerElement.scrollLeft;
          } while (previousScrollLeft !== currentScrollLeft);

          const scrollerEndPosition =
            -tabs.__direction * tabs._scrollerElement.scrollLeft + tabs._scrollerElement.offsetWidth;
          expect(scrollerEndPosition).to.equal(tabs._scrollerElement.scrollWidth);
        });

        it('should not get stuck with wide tabs when scrolled back to the start via button', async () => {
          tabs.style.width = '100px';

          // Initially scroll to the end
          tabs._scrollToItem(items.length - 1);

          const backButton = tabs.shadowRoot.querySelector('[part="back-button"]');
          let previousScrollLeft;
          let currentScrollLeft = tabs._scrollerElement.scrollLeft;
          // Click the back button until it does not have any effect
          do {
            previousScrollLeft = currentScrollLeft;
            backButton.click();
            currentScrollLeft = tabs._scrollerElement.scrollLeft;
          } while (previousScrollLeft !== currentScrollLeft);

          expect(tabs._scrollerElement.scrollLeft).to.equal(0);
        });
      });
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
