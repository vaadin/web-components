import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { getFocusedItemIndex } from './helpers.js';

describe('auto-focus-partial-match', () => {
  let comboBox, inputElement;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    await nextRender();
    inputElement = comboBox.inputElement;
    inputElement.focus();
  });

  describe('none (default)', () => {
    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should be none by default', () => {
      expect(comboBox.autoFocusPartialMatch).to.equal('none');
    });

    it('should highlight the exact match', async () => {
      await sendKeys({ type: 'grape' });
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should not highlight partial matches', async () => {
      await sendKeys({ type: 'gra' });
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    describe('value commit', () => {
      it('should commit the exact match on Enter', async () => {
        await sendKeys({ type: 'grape' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.value).to.equal('grape');
      });

      it('should commit the exact match on Tab', async () => {
        await sendKeys({ type: 'grape' });
        await sendKeys({ press: 'Tab' });
        expect(comboBox.value).to.equal('grape');
      });

      it('should commit the exact match on outside click', async () => {
        await sendKeys({ type: 'grape' });
        outsideClick();
        expect(comboBox.value).to.equal('grape');
      });

      it('should not commit the partial match on Enter', async () => {
        await sendKeys({ type: 'grap' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.value).to.equal('');
      });
    });
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.autoFocusPartialMatch = 'first-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the first partial match', async () => {
      await sendKeys({ type: 'gra' });
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should highlight the exact match when there is one', async () => {
      await sendKeys({ type: 'grape' });
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should not highlight the first partial match when custom values are allowed', async () => {
      comboBox.allowCustomValue = true;
      await sendKeys({ type: 'gra' });
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should not highlight anything when the filter is empty', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    describe('value commit', () => {
      it('should commit the first partial match on Enter', async () => {
        await sendKeys({ type: 'grap' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.value).to.equal('grapefruit');
      });

      it('should not commit on Enter when no items match', async () => {
        await sendKeys({ type: 'xyz' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.value).to.equal('');
      });

      it('should commit the first partial match on Tab', async () => {
        await sendKeys({ type: 'grap' });
        await sendKeys({ press: 'Tab' });
        expect(comboBox.value).to.equal('grapefruit');
      });

      it('should commit the first partial match on outside click', async () => {
        await sendKeys({ type: 'grap' });
        outsideClick();
        expect(comboBox.value).to.equal('grapefruit');
      });
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.autoFocusPartialMatch = 'only-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the only partial match', async () => {
      await sendKeys({ type: 'ban' });
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should not highlight anything when multiple items match', async () => {
      await sendKeys({ type: 'gra' });
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should highlight the exact match when there is one', async () => {
      await sendKeys({ type: 'grape' });
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    describe('value commit', () => {
      it('should commit the only partial match on Enter', async () => {
        await sendKeys({ type: 'grapef' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.value).to.equal('grapefruit');
      });

      it('should not commit on Enter when multiple items match', async () => {
        await sendKeys({ type: 'grap' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.value).to.equal('');
      });
    });
  });

  describe('autoOpenDisabled', () => {
    beforeEach(() => {
      comboBox.autoOpenDisabled = true;
      comboBox.autoFocusPartialMatch = 'first-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should commit the exact match on Enter while closed', async () => {
      await sendKeys({ type: 'grape' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.value).to.equal('grape');
    });

    it('should not commit the first partial match on Enter while closed', async () => {
      await sendKeys({ type: 'grap' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.value).to.equal('');
    });

    it('should highlight the first partial match when opening the dropdown after typing', async () => {
      await sendKeys({ type: 'grap' });
      await sendKeys({ press: 'ArrowDown' });
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should commit the first partial match on Enter after opening the dropdown', async () => {
      await sendKeys({ type: 'grap' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.value).to.equal('grapefruit');
    });
  });

  describe('lazy loading', () => {
    beforeEach(() => {
      const allItems = ['apple', 'banana', 'grapefruit', 'grape'];
      comboBox.dataProvider = (params, callback) => {
        setTimeout(() => {
          const filteredItems = allItems.filter((item) => item.includes(params.filter));
          callback(filteredItems, filteredItems.length);
        });
      };
    });

    it('should highlight the first partial match after the page is loaded', async () => {
      comboBox.autoFocusPartialMatch = 'first-match';

      await sendKeys({ type: 'gra' });
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should highlight the only partial match after the page is loaded', async () => {
      comboBox.autoFocusPartialMatch = 'only-match';

      await sendKeys({ type: 'ban' });
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });
  });
});
