import { expect } from '@esm-bundle/chai';
import { fixtureSync, arrowDownKeyDown, escKeyDown } from '@vaadin/testing-helpers';
import './vaadin-combo-box.js';

describe('ARIA', () => {
  let comboBox, input;

  function getItemElement(i) {
    return comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')[i];
  }

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box label="my label"></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
    input = comboBox.inputElement;
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
  });

  describe('opened', () => {
    beforeEach(() => {
      arrowDownKeyDown(input);
    });

    it('should set role listbox on the iron-list', () => {
      expect(comboBox.$.overlay._selector.getAttribute('role')).to.equal('listbox');
    });

    it('should set aria-expanded attribute when opened', () => {
      expect(input.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should unset aria-expanded attribute when closed', () => {
      escKeyDown(input);

      expect(input.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should set selection aria attributes when focusing an item', () => {
      comboBox.value = 'foo';
      arrowDownKeyDown(input); // 'focus moves to 2nd item'

      expect(getItemElement(0).getAttribute('role')).to.equal('option');
      expect(getItemElement(0).getAttribute('aria-selected')).to.equal('false');
      expect(getItemElement(1).getAttribute('aria-selected')).to.equal('true');
    });
  });
});
