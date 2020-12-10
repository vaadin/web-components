import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('ARIA', () => {
  let comboBox, input, toggle;

  function getItemElement(i) {
    return comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item')[i];
  }

  function arrowDown() {
    keyDownOn(comboBox.inputElement, 40);
  }

  function esc() {
    keyDownOn(comboBox.inputElement, 27);
  }

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box label="my label"></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
    input = comboBox._nativeInput;
    toggle = comboBox._toggleElement;
  });

  afterEach(() => {
    comboBox.opened = false;
  });

  describe('when combo-box is attached', () => {
    it('should contain appropriate aria attributes', () => {
      expect(input.getAttribute('role')).to.equal('combobox');
      expect(input.getAttribute('aria-autocomplete')).to.equal('list');
      expect(input.hasAttribute('aria-labelledby')).to.be.true;
      expect(toggle.getAttribute('role')).to.equal('button');
      expect(toggle.getAttribute('aria-label')).to.equal('Toggle');
    });
  });

  describe('when overlay opens or close', () => {
    beforeEach(() => {
      arrowDown();
    });

    it('should set role listbox on the iron-list', () => {
      expect(comboBox.$.overlay._selector.getAttribute('role')).to.equal('listbox');
    });

    it('should set aria-expanded attribute when opened', () => {
      expect(input.getAttribute('aria-expanded')).to.equal('true');
      expect(toggle.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should unset aria-expanded attribute when closed', () => {
      esc();

      expect(input.getAttribute('aria-expanded')).to.equal('false');
      expect(toggle.getAttribute('aria-expanded')).to.equal('false');
    });
  });

  describe('navigating the items', () => {
    beforeEach(() => {
      arrowDown();
    });

    it('should set selection aria attributes when focusing an item', () => {
      comboBox.value = 'foo';
      arrowDown(); // 'focus moves to 2nd item'

      expect(getItemElement(0).getAttribute('role')).to.equal('option');
      expect(getItemElement(0).getAttribute('aria-selected')).to.equal('false');
      expect(getItemElement(1).getAttribute('aria-selected')).to.equal('true');
    });
  });
});
