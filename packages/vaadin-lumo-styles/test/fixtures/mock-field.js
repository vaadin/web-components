import './mock-field.css';
import '@vaadin/input-container/src/vaadin-input-container.js';
import { html, LitElement } from 'lit';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';

class MockField extends InputFieldMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'mock-field';
  }

  static get version() {
    return '1.0.0';
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get styles() {
    return inputFieldShared;
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
