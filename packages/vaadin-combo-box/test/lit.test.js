import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, render } from 'lit';
import '../vaadin-combo-box.js';

describe('lit', () => {
  describe('renderer', () => {
    let comboBox;

    function getFirstItem() {
      return comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item');
    }

    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);

      const size = 100;

      comboBox.items = new Array(size).fill().map((e, i) => {
        return { value: `value-${i}` };
      });

      comboBox.renderer = (root, _, { index }) => {
        render(html`value-${index}`, root);
      };
    });

    it('should render the content', () => {
      comboBox.opened = true;
      expect(getFirstItem().$.content.textContent).to.equal('value-0');
    });

    it('should render new content after assigning a new renderer', () => {
      comboBox.opened = true;
      comboBox.renderer = (root, _, { index }) => {
        render(html`new-${index}`, root);
      };
      expect(getFirstItem().$.content.textContent).to.equal('new-0');
    });
  });
});
