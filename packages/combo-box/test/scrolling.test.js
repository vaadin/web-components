import { expect } from '@esm-bundle/chai';
import { fixtureSync, focusout, isIOS, nextFrame } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { getSelectedItem, onceScrolled } from './helpers.js';

describe('scrolling', () => {
  let comboBox, overlay, scroller, input;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    overlay = comboBox.$.overlay;
    input = comboBox.inputElement;
    scroller = comboBox._scroller;
  });

  afterEach(() => {
    comboBox.close();
  });

  (isIOS ? describe : describe.skip)('iOS', () => {
    it('should have momentum scrolling enabled', () => {
      comboBox.open();

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

      expect(scroller.scrollTop).to.equal(0);
    });

    it('should be zero when the first item is selected', () => {
      comboBox.value = comboBox.items[0];
      comboBox.open();

      expect(scroller.scrollTop).to.equal(0);
    });

    function expectSelectedItemPositionToBeVisible() {
      const selectedItem = getSelectedItem(comboBox);
      expect(selectedItem).to.be.ok;

      const selectedItemRect = selectedItem.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      expect(selectedItemRect.left).to.be.at.least(overlayRect.left - 1);
      expect(selectedItemRect.top).to.be.at.least(overlayRect.top - 1);
      expect(selectedItemRect.right).to.be.at.most(overlayRect.right + 1);
      expect(selectedItemRect.bottom).to.be.at.most(overlayRect.bottom + 1);
    }

    it('should make selected item visible after open', async () => {
      comboBox.value = comboBox.items[50];
      comboBox.open();
      await onceScrolled(comboBox);
      expectSelectedItemPositionToBeVisible();
    });

    it('should make selected item visible after reopen', async () => {
      comboBox.open();
      await nextFrame();

      comboBox.value = comboBox.items[50];
      comboBox.close();

      comboBox.open();
      await nextFrame();

      expectSelectedItemPositionToBeVisible();
    });

    it('should not close the items when touching scroll bar', () => {
      comboBox.open();
      focusout(input, overlay);
      expect(comboBox.opened).to.be.true;
    });

    it('should keep the focused attribute while scrolling', () => {
      comboBox.open();
      focusout(input, overlay);
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });
  });
});
