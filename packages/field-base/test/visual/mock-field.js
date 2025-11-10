import '@vaadin/input-container/src/vaadin-input-container.js';
import { html, LitElement } from 'lit';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputController } from '../..//src/input-controller.js';
import { InputFieldMixin } from '../../src/input-field-mixin.js';
import { inputFieldShared } from '../../src/styles/input-field-shared-styles.js';

class MockField extends InputFieldMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'mock-field';
  }

  static get styles() {
    return [inputFieldShared];
  }

  get clearElement() {
    return this.$.clearButton;
  }

  render() {
    return html`
      <div class="vaadin-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator"></span>
        </div>

        <vaadin-input-container part="input-field">
          <slot name="input"></slot>
          <div id="clearButton" part="field-button clear-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  ready() {
    super.ready();

    this.addController(
      new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      }),
    );
  }
}

customElements.define(MockField.is, MockField);
