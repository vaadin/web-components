/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { stepperStyles } from './styles/vaadin-stepper-base-styles.js';
import { StepperMixin } from './vaadin-stepper-mixin.js';

/**
 * `<vaadin-stepper>` is a web component for displaying a step-by-step workflow.
 *
 * ```html
 * <vaadin-stepper>Example</vaadin-stepper>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label element
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `disabled`   | Set when the element is disabled
 * `focused`    | Set when the element is focused
 * `focus-ring` | Set when the element is keyboard focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-stepper
 * @extends HTMLElement
 * @mixes StepperMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Stepper extends StepperMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-stepper';
  }

  static get styles() {
    return stepperStyles;
  }

  static get experimental() {
    return true;
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-stepper-container">
        <span part="label">
          <slot></slot>
        </span>
      </div>
    `;
  }
}

defineCustomElement(Stepper);

export { Stepper };
