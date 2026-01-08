import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '@vaadin/aura/aura.css';
import '../../../vaadin-input-container.js';

describe('input-container', () => {
  let div, element, container, input;

  customElements.define(
    'dummy-field',
    class extends HTMLElement {
      constructor() {
        super();

        // Wrap input container with a shadow root,
        // as Aura relies on `::part(input-field)`
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
          <vaadin-input-container part="input-field">
            <slot></slot>
          </vaadin-input-container>
        `;
      }

      get disabled() {
        return container.disabled;
      }

      set disabled(disabled) {
        this.toggleAttribute('disabled', disabled);
        container.disabled = disabled;
      }
    },
  );

  beforeEach(() => {
    div = document.createElement('div');
    div.style.width = 'fit-content';
    div.style.padding = '10px';
    element = fixtureSync('<dummy-field><input></dummy-field>', div);
    container = element.shadowRoot.querySelector('vaadin-input-container');
    input = element.querySelector('input');
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('value', async () => {
    input.value = 'value';
    await visualDiff(div, 'value');
  });

  it('readonly', async () => {
    container.readonly = true;
    await visualDiff(div, 'readonly');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('disabled value', async () => {
    input.value = 'value';
    element.disabled = true;
    await visualDiff(div, 'disabled-value');
  });
});
