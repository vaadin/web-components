import { html, LitElement } from 'lit';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { FieldMixin } from '../../src/field-mixin.js';
import { field } from '../../src/styles/field-base-styles.js';
import { group } from '../../src/styles/group-base-styles.js';

class MockGroupField extends FieldMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'mock-group-field';
  }

  static get version() {
    return '1.0.0';
  }

  static get styles() {
    return [field, group];
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
