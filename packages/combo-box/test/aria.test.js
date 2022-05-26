import { expect } from '@esm-bundle/chai';
import { arrowDownKeyDown, aTimeout, escKeyDown, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { getAllItems } from './helpers.js';

describe('ARIA', () => {
  let comboBox, input, label, helper, error;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box label="my label" helper-text="Helper"></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
    input = comboBox.inputElement;
    label = comboBox.querySelector('[slot=label]');
    error = comboBox.querySelector('[slot=error-message]');
    helper = comboBox.querySelector('[slot=helper]');
  });

  afterEach(() => {
    comboBox.opened = false;
  });

  describe('default', () => {
    it('should set role attribute on the native input', () => {
      expect(input.getAttribute('role')).to.equal('combobox');
    });

    it('should set aria-autocomplete attribute on the native input', () => {
      expect(input.getAttribute('aria-autocomplete')).to.equal('list');
    });

    it('should set aria-labelledby attribute on the native input', () => {
      expect(input.getAttribute('aria-labelledby')).to.equal(label.id);
    });

    it('should set aria-describedby with helper text ID when valid', () => {
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.not.include(error.id);
    });

    it('should add error message ID to aria-describedby when invalid', async () => {
      comboBox.invalid = true;
      await aTimeout(0);
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.include(error.id);
    });

    it('should set spellcheck attribute on the native input', () => {
      expect(input.getAttribute('spellcheck')).to.equal('false');
    });

    it('should set autocorrect attribute on the native input', () => {
      expect(input.getAttribute('autocorrect')).to.equal('off');
    });
  });

  describe('opened', () => {
    let scroller, items;

    beforeEach(async () => {
      arrowDownKeyDown(input);
      scroller = comboBox._scroller;
      items = getAllItems(comboBox);
      await nextFrame();
    });

    it('should set role listbox on the scroller', () => {
      expect(scroller.getAttribute('role')).to.equal('listbox');
    });

    it('should set aria-setsize attribute on the scroller', () => {
      expect(scroller.getAttribute('aria-setsize')).to.equal(comboBox.items.length.toString());
    });

    it('should set aria-controls on the native input', () => {
      expect(input.getAttribute('aria-controls')).to.equal(scroller.id);
    });

    it('should remove aria-controls attribute when closed', () => {
      escKeyDown(input);

      expect(input.hasAttribute('aria-controls')).to.be.false;
    });

    it('should set aria-expanded attribute when opened', () => {
      expect(input.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should unset aria-expanded attribute when closed', () => {
      escKeyDown(input);

      expect(input.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should set role attribute on the dropdown items', () => {
      items.forEach((item) => {
        expect(item.getAttribute('role')).to.equal('option');
      });
    });

    it('should set ID on the dropdown items', () => {
      items.forEach((item) => {
        expect(item.id).to.match(/^vaadin-combo-box-item-\d+$/);
      });
    });

    it('should set aria-posinset attribute on the dropdown items', () => {
      items.forEach((item, idx) => {
        expect(item.getAttribute('aria-posinset')).to.equal((idx + 1).toString());
      });
    });

    it('should set aria-activedescendant on the input', () => {
      expect(input.hasAttribute('aria-activedescendant')).to.be.false;

      arrowDownKeyDown(input); // 'focus moves to 1st item'
      expect(input.getAttribute('aria-activedescendant')).to.equal(items[0].id);
    });

    it('should update aria-selected when focused item changes', () => {
      comboBox.value = 'foo';
      arrowDownKeyDown(input); // 'focus moves to 2nd item'

      expect(items[0].getAttribute('aria-selected')).to.equal('false');
      expect(items[1].getAttribute('aria-selected')).to.equal('true');
    });

    it('should update aria-activedescendant when focused item changes', () => {
      comboBox.value = 'foo';
      arrowDownKeyDown(input); // 'focus moves to 2nd item'

      expect(input.getAttribute('aria-activedescendant')).to.equal(items[1].id);
    });
  });
});
