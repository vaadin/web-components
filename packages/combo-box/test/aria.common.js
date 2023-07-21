import { expect } from '@esm-bundle/chai';
import { arrowDownKeyDown, escKeyDown, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { getAllItems } from './helpers.js';

describe('ARIA', () => {
  let comboBox, input;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    await nextRender();
    input = comboBox.inputElement;
    comboBox.items = ['foo', 'bar', 'baz'];
    await nextUpdate(comboBox);
  });

  it('should toggle aria-expanded attribute on open', async () => {
    arrowDownKeyDown(input);
    await nextUpdate(comboBox);
    expect(input.getAttribute('aria-expanded')).to.equal('true');

    escKeyDown(input);
    await nextUpdate(comboBox);
    expect(input.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should toggle aria-controls attribute on open', async () => {
    arrowDownKeyDown(input);
    await nextUpdate(comboBox);
    expect(input.hasAttribute('aria-controls')).to.be.true;

    escKeyDown(input);
    await nextUpdate(comboBox);
    expect(input.hasAttribute('aria-controls')).to.be.false;
  });

  describe('opened', () => {
    let items;

    beforeEach(async () => {
      arrowDownKeyDown(input);
      await nextUpdate(comboBox);
      items = getAllItems(comboBox);
    });

    it('should set aria-activedescendant on the input element depending on the focused item', async () => {
      arrowDownKeyDown(input); // Move focus to the 1st item.
      await nextUpdate(comboBox);
      expect(input.getAttribute('aria-activedescendant')).to.equal(items[0].id);

      arrowDownKeyDown(input); // Move focus to the 2nd item.
      await nextUpdate(comboBox);
      expect(input.getAttribute('aria-activedescendant')).to.equal(items[1].id);
    });

    it('should set aria-selected on item elements depending on the selected item', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);
      await nextUpdate(comboBox._scroller);
      expect(items[0].getAttribute('aria-selected')).to.equal('true');
      expect(items[1].getAttribute('aria-selected')).to.equal('false');

      comboBox.value = 'bar';
      await nextUpdate(comboBox);
      await nextUpdate(comboBox._scroller);
      expect(items[0].getAttribute('aria-selected')).to.equal('false');
      expect(items[1].getAttribute('aria-selected')).to.equal('true');
    });
  });
});
