import { expect } from '@vaadin/chai-plugins';
import {
  arrowDownKeyDown,
  arrowUpKeyDown,
  escKeyDown,
  fixtureSync,
  nextFrame,
  nextRender,
} from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { getAllItems, getFocusedItemIndex, makeItems, setInputValue } from './helpers.js';

describe('ARIA', () => {
  let comboBox, input;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
    await nextRender();
    input = comboBox.inputElement;
  });

  it('should toggle aria-expanded attribute on open', () => {
    arrowDownKeyDown(input);
    expect(input.getAttribute('aria-expanded')).to.equal('true');
    escKeyDown(input);
    expect(input.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should toggle aria-controls attribute on open', () => {
    arrowDownKeyDown(input);
    expect(input.hasAttribute('aria-controls')).to.be.true;
    escKeyDown(input);
    expect(input.hasAttribute('aria-controls')).to.be.false;
  });

  describe('opened', () => {
    let items;

    beforeEach(async () => {
      arrowDownKeyDown(input);
      await nextFrame();
      items = getAllItems(comboBox);
    });

    it('should set aria-activedescendant on the input element depending on the focused item', () => {
      arrowDownKeyDown(input); // Move focus to the 1st item.
      expect(input.getAttribute('aria-activedescendant')).to.equal(items[0].id);
      arrowDownKeyDown(input); // Move focus to the 2nd item.
      expect(input.getAttribute('aria-activedescendant')).to.equal(items[1].id);
    });

    it('should set aria-selected on item elements depending on the selected item', () => {
      comboBox.value = 'foo';
      expect(items[0].getAttribute('aria-selected')).to.equal('true');
      expect(items[1].getAttribute('aria-selected')).to.equal('false');

      comboBox.value = 'bar';
      expect(items[0].getAttribute('aria-selected')).to.equal('false');
      expect(items[1].getAttribute('aria-selected')).to.equal('true');
    });
  });

  describe('opened on input', () => {
    it('should set aria-activedescendant to the item matching the input', () => {
      setInputValue(comboBox, 'bar');
      const focusedItem = getAllItems(comboBox)[getFocusedItemIndex(comboBox)];
      expect(focusedItem.textContent.trim()).to.equal('bar');
      expect(input.getAttribute('aria-activedescendant')).to.equal(focusedItem.id);
    });

    it('should set aria-activedescendant to the item matching the input outside the viewport', () => {
      comboBox.items = [...makeItems(50), 'item'];
      setInputValue(comboBox, 'item');
      const focusedItem = getAllItems(comboBox)[getFocusedItemIndex(comboBox)];
      expect(focusedItem.textContent.trim()).to.equal('item');
      expect(input.getAttribute('aria-activedescendant')).to.equal(focusedItem.id);
    });
  });

  describe('opened with virtualized items', () => {
    beforeEach(async () => {
      comboBox.items = makeItems(100);
      await nextRender();
      arrowDownKeyDown(input);
      await nextFrame();
    });

    it('should set aria-activedescendant when focusing an item outside the viewport', async () => {
      // Move focus to the last item, which is not rendered until it scrolls into view.
      arrowUpKeyDown(input);
      await nextFrame();

      const lastItem = getAllItems(comboBox).find((item) => item.index === comboBox.items.length - 1);
      expect(input.getAttribute('aria-activedescendant')).to.equal(lastItem.id);
    });
  });
});
