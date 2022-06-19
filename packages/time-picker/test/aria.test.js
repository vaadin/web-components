import { expect } from '@esm-bundle/chai';
import { arrowDownKeyDown, escKeyDown, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-time-picker.js';

describe('ARIA', () => {
  let timePicker, comboBox, input;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    comboBox = timePicker.$.comboBox;
    input = timePicker.inputElement;
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
      items = comboBox._scroller.querySelectorAll('vaadin-time-picker-item');
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
