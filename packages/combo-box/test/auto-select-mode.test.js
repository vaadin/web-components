import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, outsideClick, tabKeyDown } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import { getFocusedItemIndex, setInputValue } from './helpers.js';

describe('auto-select-mode', () => {
  let comboBox, input;

  beforeEach(async () => {
    [comboBox] = fixtureSync(
      `<div>
        <vaadin-combo-box></vaadin-combo-box>
        <input id="last-global-focusable" />
      </div>`,
    ).children;
    await nextRender();
    input = comboBox.inputElement;
  });

  describe('default', () => {
    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should be full-match by default', () => {
      expect(comboBox.autoSelectMode).to.equal('full-match');
    });

    it('should not select the first matching item on outside click', () => {
      setInputValue(comboBox, 'gra');

      outsideClick();

      expect(comboBox.value).to.equal('');
      expect(input.value).to.equal('');
    });

    it('should select the exact match on outside click', () => {
      setInputValue(comboBox, 'grape');

      outsideClick();

      expect(comboBox.value).to.equal('grape');
    });
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'first-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the first matching item while typing', () => {
      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should select the first matching item on outside click', () => {
      setInputValue(comboBox, 'gra');

      outsideClick();

      expect(comboBox.value).to.equal('grapefruit');
      expect(input.value).to.equal('grapefruit');
    });

    it('should select the first matching item on Enter', async () => {
      input.focus();
      await sendKeys({ type: 'gra' });

      await sendKeys({ press: 'Enter' });

      expect(comboBox.value).to.equal('grapefruit');
    });

    it('should select the first matching item on Tab', async () => {
      input.focus();
      await sendKeys({ type: 'gra' });

      await sendKeys({ press: 'Tab' });

      expect(comboBox.value).to.equal('grapefruit');
    });

    it('should highlight the exact match instead of the first matching item', () => {
      setInputValue(comboBox, 'grape');

      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should select the exact match instead of the first matching item', () => {
      setInputValue(comboBox, 'grape');

      outsideClick();

      expect(comboBox.value).to.equal('grape');
    });

    it('should not select anything on outside click when filter is empty', () => {
      comboBox.open();

      outsideClick();

      expect(comboBox.value).to.equal('');
    });

    it('should not select anything when no item matches the filter', () => {
      setInputValue(comboBox, 'xyz');

      outsideClick();

      expect(comboBox.value).to.equal('');
      expect(input.value).to.equal('');
    });

    it('should not select the first matching item after clearing the filter', () => {
      setInputValue(comboBox, 'gra');
      setInputValue(comboBox, '');

      outsideClick();

      expect(comboBox.value).to.equal('');
    });

    it('should not select on outside click after Escape removed the highlight', async () => {
      input.focus();
      await sendKeys({ type: 'gra' });

      await sendKeys({ press: 'Escape' });
      outsideClick();

      expect(comboBox.value).to.equal('');
    });

    it('should start keyboard navigation from the highlighted item', async () => {
      input.focus();
      await sendKeys({ type: 'gra' });

      await sendKeys({ press: 'ArrowDown' });

      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should fire custom-value-set instead when custom values are allowed', () => {
      comboBox.allowCustomValue = true;
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);

      outsideClick();

      expect(spy).to.be.calledOnce;
      expect(comboBox.value).to.equal('gra');
      expect(comboBox.selectedItem).to.be.null;
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'only-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should not highlight the first item when multiple items match', () => {
      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should not select anything on outside click when multiple items match', () => {
      setInputValue(comboBox, 'gra');

      outsideClick();

      expect(comboBox.value).to.equal('');
      expect(input.value).to.equal('');
    });

    it('should highlight the item when only one item matches', () => {
      setInputValue(comboBox, 'ban');

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should select the only matching item on outside click', () => {
      setInputValue(comboBox, 'ban');

      outsideClick();

      expect(comboBox.value).to.equal('banana');
      expect(input.value).to.equal('banana');
    });

    it('should select the only matching item on Enter', async () => {
      input.focus();
      await sendKeys({ type: 'ban' });

      await sendKeys({ press: 'Enter' });

      expect(comboBox.value).to.equal('banana');
    });

    it('should select the exact match when multiple items match', () => {
      setInputValue(comboBox, 'grape');

      outsideClick();

      expect(comboBox.value).to.equal('grape');
    });
  });

  describe('lazy loading', () => {
    let allItems;

    // A data provider that emulates the user tabbing out of the input
    // before data is returned, so that the commit is deferred until
    // the page is loaded.
    const bluringDataProvider = (params, callback) => {
      tabKeyDown(input);
      input.blur();
      const filteredItems = allItems.filter((item) => item.includes(params.filter));
      callback(filteredItems, filteredItems.length);
    };

    beforeEach(() => {
      allItems = ['apple', 'banana', 'grapefruit', 'grape'];
      comboBox.focus();
      comboBox.opened = true;
      comboBox.dataProvider = bluringDataProvider;
      comboBox.opened = false;
      input.focus();
    });

    it('should select the first matching item when blurred while loading', () => {
      comboBox.autoSelectMode = 'first-match';

      setInputValue(comboBox, 'gra');

      expect(comboBox.opened).to.be.false;
      expect(comboBox.value).to.equal('grapefruit');
    });

    it('should select the only matching item when blurred while loading', () => {
      comboBox.autoSelectMode = 'only-match';

      setInputValue(comboBox, 'ban');

      expect(comboBox.opened).to.be.false;
      expect(comboBox.value).to.equal('banana');
    });

    it('should not select anything when multiple items match in only-match mode', () => {
      comboBox.autoSelectMode = 'only-match';

      setInputValue(comboBox, 'gra');

      expect(comboBox.value).to.equal('');
    });
  });
});
