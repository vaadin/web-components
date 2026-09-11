import './mock-group-field.css';
import { html, LitElement } from 'lit';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';

class MockGroupField extends FieldMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'mock-group-field';
  }

  static get version() {
    return '1.0.0';
  }

  render() {
    return html`
      <div class="vaadin-group-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator"></span>
        </div>

        <div part="group-field">
          <slot></slot>
        </div>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define(MockGroupField.is, MockGroupField);
