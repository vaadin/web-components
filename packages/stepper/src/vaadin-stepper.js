/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-step.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { stepperStyles } from './styles/vaadin-stepper-base-styles.js';
import { Step } from './vaadin-step.js';

const DEFAULT_I18N = {
  completed: 'Completed',
  invalid: 'Error',
};

/**
 * `<vaadin-stepper>` is a Web Component that shows the user's progress
 * through a linear, multi-step process such as a checkout or a wizard.
 *
 * ```html
 * <vaadin-stepper>
 *   <vaadin-step completed path="/checkout/cart">Shopping cart</vaadin-step>
 *   <vaadin-step current>Shipping & billing</vaadin-step>
 *   <vaadin-step>Payment method</vaadin-step>
 *   <vaadin-step>Confirmation</vaadin-step>
 * </vaadin-stepper>
 * ```
 *
 * The stepper numbers its visible steps automatically. The application
 * marks steps as `current`, `completed` or `invalid`.
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute     | Description
 * --------------|------------
 * `orientation` | The orientation of the stepper, `horizontal` or `vertical`.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                          |
 * :--------------------------------------------|
 * | `--vaadin-stepper-accent-color`            |
 * | `--vaadin-stepper-accent-contrast-color`   |
 * | `--vaadin-stepper-completed-icon`          |
 * | `--vaadin-stepper-connector-color`         |
 * | `--vaadin-stepper-connector-width`         |
 * | `--vaadin-stepper-error-color`             |
 * | `--vaadin-stepper-error-contrast-color`    |
 * | `--vaadin-stepper-font-size`               |
 * | `--vaadin-stepper-gap`                     |
 * | `--vaadin-stepper-indicator-background`    |
 * | `--vaadin-stepper-indicator-border-color`  |
 * | `--vaadin-stepper-indicator-border-radius` |
 * | `--vaadin-stepper-indicator-font-size`     |
 * | `--vaadin-stepper-indicator-size`          |
 * | `--vaadin-stepper-invalid-icon`            |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @attr {string} theme - The theme variants to apply to the component.
 * @customElement vaadin-stepper
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes I18nMixin
 */
class Stepper extends I18nMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-stepper';
  }

  static get experimental() {
    return 'stepperComponent';
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get styles() {
    return stepperStyles;
  }

  static get properties() {
    return {
      /**
       * The orientation of the stepper, `horizontal` (default) or `vertical`.
       */
      orientation: {
        type: String,
        value: 'horizontal',
        reflectToAttribute: true,
        sync: true,
      },
    };
  }

  static get defaultI18n() {
    return DEFAULT_I18N;
  }

  /**
   * The object used to localize this component. To change the default
   * localization, set this to an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Text announced to assistive technology for completed steps.
   *   completed: 'Completed',
   *
   *   // Text announced to assistive technology for invalid steps.
   *   invalid: 'Error'
   * }
   * ```
   *
   * @type {StepperI18n | undefined}
   */
  get i18n() {
    return super.i18n;
  }

  set i18n(value) {
    super.i18n = value;
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'list');
    }

    this.__slotObserver = new SlotObserver(this.shadowRoot.querySelector('slot'), () => this.__updateSteps(), {
      syncInitial: true,
    });

    // Re-number the steps when one of them is hidden or shown.
    this.__hiddenObserver = new MutationObserver(() => this.__updateSteps());
    this.__hiddenObserver.observe(this, { attributeFilter: ['hidden'], subtree: true });
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if ((props.has('orientation') || props.has('__effectiveI18n')) && this.__slotObserver) {
      this.__updateSteps();
    }
  }

  /** @private */
  __getSteps() {
    return [...this.children].filter((child) => child instanceof Step);
  }

  /** @private */
  __updateSteps() {
    const visibleSteps = this.__getSteps().filter((step) => !step.hidden);

    visibleSteps.forEach((step, index) => {
      step._position = index + 1;
      step._last = index === visibleSteps.length - 1;
      step._i18n = this.__effectiveI18n;
      step.setAttribute('orientation', this.orientation);
    });
  }
}

defineCustomElement(Stepper);

export { Stepper };
