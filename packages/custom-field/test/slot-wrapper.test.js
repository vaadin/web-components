import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-custom-field.js';

class XField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <vaadin-custom-field id="customField">
        <slot></slot>
      </vaadin-custom-field>
    `;
  }
}

customElements.define('x-field', XField);

class XField2 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <vaadin-custom-field id="customField">
        <div id="wrapper">
          <slot></slot>
        </div>
      </vaadin-custom-field>
    `;
  }
}

customElements.define('x-field2', XField2);

const fixtures = {
  default: `
    <vaadin-custom-field>
      <input type="text">
      <input type="number">
    </vaadin-custom-field>
  `,
  nested: `
    <x-field>
      <input type="text">
      <input type="number">
    </x-field>
  `,
  nested2: `
    <x-field2>
      <input type="text">
      <input type="number">
    </x-field2>
  `,
  deep: `
    <x-field>
      <div>
        <div>
          <input type="text">
          <input type="number">
        </div>
      </div>
    </x-field>
  `,
  deep2: `
    <x-field2>
      <div>
        <div>
          <input type="text">
          <input type="number">
        </div>
      </div>
    </x-field2>
  `,
};

Object.keys(fixtures).forEach((set) => {
  describe(`slot updates (${set})`, () => {
    let parent, customField, inputElement;

    beforeEach(async () => {
      // 'parent' is the element to add and remove inputs to/from for testing
      const root = fixtureSync(fixtures[set]);
      if (set === 'nested' || set === 'nested2') {
        parent = root; // <x-field>
        customField = root.shadowRoot.querySelector('vaadin-custom-field');
      } else if (set === 'deep' || set === 'deep2') {
        parent = root.firstElementChild.firstElementChild; // Inner <div>
        customField = root.shadowRoot.querySelector('vaadin-custom-field');
      } else {
        parent = root; // <custom-field>
        customField = root; // <custom-field>
      }
      inputElement = document.createElement('input');
      // Wait for initial slotchange
      await nextRender();
    });

    it('should add new input to the input list when adding to the DOM', async () => {
      parent.appendChild(inputElement);
      await nextFrame();
      expect(customField.inputs.length).to.equal(3);
      expect(customField.inputs[2]).to.eql(inputElement);
    });

    it('should remove input from the input list when removing from the DOM', async () => {
      // Remove one of the inputs from the DOM
      parent.removeChild(parent.children[1]);
      await nextFrame();
      expect(customField.inputs.length).to.equal(1);
    });

    describe('value property', () => {
      it('should update value when input is added', async () => {
        inputElement.value = 'foo';
        parent.appendChild(inputElement);
        await nextFrame();
        // Two empty spaces are from empty inputs
        expect(customField.value).to.equal('\t\tfoo');
      });

      it('should update value when input is removed', async () => {
        const secondInput = parent.children[1];
        secondInput.value = '1';
        fire(secondInput, 'change');
        expect(customField.value).to.equal('\t1');
        parent.removeChild(secondInput);
        await nextFrame();
        expect(customField.value).to.equal('');
      });
    });
  });
});
