import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { IOS, onceOpened, onceScrolled } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('scrolling', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
  });

  (IOS ? describe : describe.skip)('iOS', () => {
    it('should have momentum scrolling enabled', () => {
      comboBox.open();

      const scroller = comboBox.$.overlay._scroller;
      expect(getComputedStyle(scroller).WebkitOverflowScrolling).to.equal('touch');
    });
  });

  describe('the height of scroller', () => {
    beforeEach(() => {
      document.body.style.height = '100px';
      const items = [];

      for (let i = 0; i < 100; i++) {
        items.push(i.toString());
      }

      comboBox.items = items;
    });

    afterEach(() => {
      document.body.style.height = null;
    });

    it('should the height of scroller extends taller than mins-height for many items', () => {
      comboBox.open();

      const scroller = comboBox.$.overlay._scroller;
      const height = parseFloat(getComputedStyle(scroller).height.split('p')[0]);
      expect(height).to.above(116);
    });
  });

  describe('scrolling position', () => {
    beforeEach(() => {
      const items = [];

      for (let i = 0; i < 100; i++) {
        items.push(i.toString());
      }

      comboBox.items = items;
    });

    it('should be zero when no items are selected', () => {
      comboBox.open();

      expect(comboBox.$.overlay._scroller.scrollTop).to.equal(0);
    });

    it('should be zero when the first item is selected', () => {
      comboBox.value = comboBox.items[0];
      comboBox.open();

      expect(comboBox.$.overlay._scroller.scrollTop).to.equal(0);
    });

    function expectSelectedItemPositionToBeVisible() {
      const selectedItem = comboBox.$.overlay._selector.querySelector('[selected]');
      expect(selectedItem).to.be.ok;

      const selectedItemRect = selectedItem.getBoundingClientRect();
      const overlayRect = comboBox.$.overlay.$.dropdown.$.overlay.getBoundingClientRect();
      expect(selectedItemRect.left).to.be.at.least(overlayRect.left - 1);
      expect(selectedItemRect.top).to.be.at.least(overlayRect.top - 1);
      expect(selectedItemRect.right).to.be.at.most(overlayRect.right + 1);
      expect(selectedItemRect.bottom).to.be.at.most(overlayRect.bottom + 1);
    }

    it('should make selected item visible after open', (done) => {
      comboBox.value = comboBox.items[50];
      comboBox.open();

      onceScrolled(comboBox.$.overlay._scroller).then(() => {
        expectSelectedItemPositionToBeVisible();
        done();
      });
    });

    it('should make selected item visible after reopen', (done) => {
      comboBox.open();

      comboBox.value = comboBox.items[50];
      comboBox.close();

      onceOpened(comboBox).then(() => {
        expectSelectedItemPositionToBeVisible();
        done();
      });

      comboBox.open();
    });

    it('should not close the items when touching scroll bar', () => {
      comboBox.open();
      const e = new CustomEvent('focusout', { bubbles: true, composed: true });
      e.relatedTarget = comboBox.$.overlay.$.dropdown.$.overlay;
      comboBox.inputElement.dispatchEvent(e);

      expect(comboBox.opened).to.be.true;
    });

    it('should keep the input focused while scrolling', () => {
      comboBox.open();
      const e = new CustomEvent('focusout', { bubbles: true, composed: true });
      e.relatedTarget = comboBox.$.overlay.$.dropdown.$.overlay;
      comboBox.inputElement.dispatchEvent(e);

      expect(comboBox.inputElement.hasAttribute('focused')).to.be.true;
    });
  });
});
