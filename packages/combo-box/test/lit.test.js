import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { html, LitElement, render } from 'lit';
import { getViewportItems } from './helpers.js';

describe('lit', () => {
  describe('renderer', () => {
    let comboBox;

    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
      await nextRender();

      const size = 100;

      comboBox.items = new Array(size).fill().map((_, i) => {
        return { value: `value-${i}` };
      });

      comboBox.renderer = (root, _, { index }) => {
        render(html`value-${index}`, root);
      };
    });

    it('should render the content', () => {
      comboBox.opened = true;
      expect(getViewportItems(comboBox)[0].textContent).to.equal('value-0');
    });

    it('should render new content after assigning a new renderer', () => {
      comboBox.opened = true;
      comboBox.renderer = (root, _, { index }) => {
        render(html`new-${index}`, root);
      };
      expect(getViewportItems(comboBox)[0].textContent).to.equal('new-0');
    });
  });

  describe('complex structure', () => {
    let container, comboBox, selector;

    class TestSlotContainer extends LitElement {
      render() {
        return html`<slot></slot> `;
      }
    }
    customElements.define('test-slot-container', TestSlotContainer);

    class TestSlottedComboComponent extends LitElement {
      render() {
        return html`
          <test-slot-container>
            <vaadin-combo-box .items="${['First', 'Second', 'Third']}"></vaadin-combo-box>
          </test-slot-container>
        `;
      }
    }
    customElements.define('test-slotted-combo-component', TestSlottedComboComponent);

    beforeEach(async () => {
      container = fixtureSync('<div></div>');
      render(html`<test-slotted-combo-component></test-slotted-combo-component>`, container);
      await nextFrame();
      const component = container.querySelector('test-slotted-combo-component');
      comboBox = component.shadowRoot.querySelector('vaadin-combo-box');
      selector = comboBox._scroller.shadowRoot.children.selector;
    });

    it('should not show horizontal scrollbar when placed in slotted container', () => {
      comboBox.open();

      expect(getComputedStyle(selector).position).to.equal('relative');
    });
  });
});
