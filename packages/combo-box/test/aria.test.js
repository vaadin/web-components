import { expect } from '@esm-bundle/chai';
import { arrowDownKeyDown, escKeyDown, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { getAllItems } from './helpers.js';

describe('ARIA', () => {
  let comboBox, input;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
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
      items = getAllItems(comboBox);
      await nextFrame();
    });

    it('should set aria-activedescendant on the input element depending on the focused item', () => {
      arrowDownKeyDown(input); // Move focus to the 1st item.
      expect(input.getAttribute('aria-activedescendant')).to.equal(items[0].id);
      arrowDownKeyDown(input); // Move focus to the 2nd item.
      expect(input.getAttribute('aria-activedescendant')).to.equal(items[1].id);
    });

    it('should set aria-selected on item elements depending on the focused item', () => {
      arrowDownKeyDown(input); // Move focus to the 1st item.
      expect(items[0].getAttribute('aria-selected')).to.equal('true');
      expect(items[1].getAttribute('aria-selected')).to.equal('false');
      arrowDownKeyDown(input); // Move focus to the 2nd item.
      expect(items[0].getAttribute('aria-selected')).to.equal('false');
      expect(items[1].getAttribute('aria-selected')).to.equal('true');
    });
  });
});
