import './mock-group-field.css';
import { html, LitElement } from 'lit';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { field, fieldLabelAside } from '@vaadin/field-base/src/styles/field-base-styles.js';
import { group } from '@vaadin/field-base/src/styles/group-base-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';

class MockGroupField extends FieldMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'mock-group-field';
  }

  static get version() {
    return '1.0.0';
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get styles() {
    return [field, fieldLabelAside, group];
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
