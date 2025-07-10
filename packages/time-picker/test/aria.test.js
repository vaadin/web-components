import { expect } from '@vaadin/chai-plugins';
import { arrowDownKeyDown, escKeyDown, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-time-picker.js';

describe('ARIA', () => {
  let timePicker, input;

  beforeEach(async () => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    await nextRender();
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
      items = timePicker._scroller.querySelectorAll('vaadin-time-picker-item');
      await nextFrame();
    });

    it('should set aria-activedescendant on the input element depending on the focused item', () => {
      arrowDownKeyDown(input); // Move focus to the 1st item.
      expect(input.getAttribute('aria-activedescendant')).to.equal(items[0].id);
      arrowDownKeyDown(input); // Move focus to the 2nd item.
      expect(input.getAttribute('aria-activedescendant')).to.equal(items[1].id);
    });

    it('should set aria-selected on item elements depending on the selected item', async () => {
      timePicker.value = '00:00';
      await nextFrame();
      expect(items[0].getAttribute('aria-selected')).to.equal('true');
      expect(items[1].getAttribute('aria-selected')).to.equal('false');

      timePicker.value = '01:00';
      await nextFrame();
      expect(items[0].getAttribute('aria-selected')).to.equal('false');
      expect(items[1].getAttribute('aria-selected')).to.equal('true');
    });
  });

  describe('step', () => {
    it('should not set role to combo-box when step is less than 900 seconds', () => {
      timePicker.step = 600;
      expect(input.hasAttribute('role')).to.be.false;
    });

    it('should restore role to combo-box when step is set back to bigger value', () => {
      timePicker.step = 600;

      timePicker.step = 900;
      expect(input.getAttribute('role')).to.be.equal('combobox');
    });

    it('should remove aria-expanded attribute when step is less than 900 seconds', () => {
      timePicker.step = 600;
      expect(input.hasAttribute('aria-expanded')).to.be.false;
    });

    it('should restore aria-expanded attribute when step is set back to bigger value', () => {
      timePicker.step = 600;

      timePicker.step = 900;
      expect(input.getAttribute('aria-expanded')).to.be.equal('false');
    });
  });
});
