import { expect } from '@esm-bundle/chai';
import { fixtureSync, arrowDownKeyDown, escKeyDown } from '@vaadin/testing-helpers';
import { getAllItems } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('ARIA', () => {
  let comboBox, input, toggle;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box label="my label"></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar', 'baz'];
    input = comboBox._nativeInput;
    toggle = comboBox._toggleElement;
  });

  afterEach(() => {
    comboBox.opened = false;
  });

  describe('default', () => {
    it('should contain appropriate aria attributes', () => {
      expect(input.getAttribute('role')).to.equal('combobox');
      expect(input.getAttribute('aria-autocomplete')).to.equal('list');
      expect(input.hasAttribute('aria-labelledby')).to.be.true;
      expect(toggle.getAttribute('role')).to.equal('button');
      expect(toggle.getAttribute('aria-label')).to.equal('Toggle');
    });
  });

  describe('opened', () => {
    beforeEach(() => {
      arrowDownKeyDown(input);
    });

    it('should set role listbox on the scroller', () => {
      const scroller = comboBox.$.dropdown._scroller;
      expect(scroller.getAttribute('role')).to.equal('listbox');
    });

    it('should set aria-expanded attribute when opened', () => {
      expect(input.getAttribute('aria-expanded')).to.equal('true');
      expect(toggle.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should unset aria-expanded attribute when closed', () => {
      escKeyDown(input);

      expect(input.getAttribute('aria-expanded')).to.equal('false');
      expect(toggle.getAttribute('aria-expanded')).to.equal('false');
    });
  });

  describe('navigating the items', () => {
    beforeEach(() => {
      arrowDownKeyDown(input);
    });

    it('should set selection aria attributes when focusing an item', () => {
      comboBox.value = 'foo';
      arrowDownKeyDown(input); // 'focus moves to 2nd item'

      const items = getAllItems(comboBox);
      expect(items[0].getAttribute('role')).to.equal('option');
      expect(items[0].getAttribute('aria-selected')).to.equal('false');
      expect(items[1].getAttribute('aria-selected')).to.equal('true');
    });
  });
});
