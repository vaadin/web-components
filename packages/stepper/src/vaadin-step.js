/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { screenReaderOnly } from '@vaadin/a11y-base/src/styles/sr-only-styles.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { stepStyles } from './styles/vaadin-step-base-styles.js';

/**
 * `<vaadin-step>` is a single step inside a `<vaadin-stepper>`.
 *
 * ```html
 * <vaadin-step completed path="/checkout/cart">
 *   Shopping cart
 *   <span slot="description">3 items</span>
 * </vaadin-step>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name     | Description
 * --------------|------------
 * `link`        | The interactive `<a>` rendered when `path` is set.
 * `nolink`      | The non-interactive element rendered when `path` is unset.
 * `indicator`   | The circle showing the step number, or the completed / invalid icon.
 * `content`     | Wraps the label and the description.
 * `label`       | Wraps the step's text content.
 * `description` | Wraps the content of the `description` slot.
 * `connector`   | The line connecting the step to the next one. Not rendered for the last step.
 *
 * The following state attributes are available for styling:
 *
 * Attribute     | Description
 * --------------|------------
 * `current`     | Set when the step is the current step.
 * `completed`   | Set when the step is completed.
 * `invalid`     | Set when the step needs attention.
 * `disabled`    | Set when the step is disabled.
 * `focus-ring`  | Set when the step is focused by the keyboard.
 * `focused`     | Set when the step is focused.
 * `orientation` | Set by the parent `<vaadin-stepper>` to its orientation.
 *
 * See `<vaadin-stepper>` for the custom CSS properties that are available for styling.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-step
 * @extends HTMLElement
 * @mixes DisabledMixin
 * @mixes ElementMixin
 * @mixes FocusMixin
 */
class Step extends FocusMixin(DisabledMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-step';
  }

  static get experimental() {
    return 'stepperComponent';
  }

  static get shadowRootOptions() {
    return { ...LitElement.shadowRootOptions, delegatesFocus: true };
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get styles() {
    return [stepStyles, screenReaderOnly];
  }

  static get properties() {
    return {
      /**
       * The path to navigate to. When set, the step renders as a link
       * (`<a part="link">`); when unset, it renders as a non-interactive
       * element (`<div part="nolink">`).
       */
      path: {
        type: String,
      },

      /**
       * When true, the step is the current step of the process.
       * It is announced to assistive technology with `aria-current="step"`.
       */
      current: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * When true, the step is completed. The indicator shows a check mark
       * instead of the step number.
       */
      completed: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * When true, the step needs attention, e.g. because it contains invalid
       * data. The indicator shows an error icon instead of the step number.
       * Takes visual precedence over `completed`.
       */
      invalid: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * The 1-based position of the step among the visible steps,
       * set by the parent `<vaadin-stepper>`.
       * @protected
       */
      _position: {
        type: Number,
        attribute: false,
      },

      /**
       * Whether the step is the last visible step, set by the parent
       * `<vaadin-stepper>`. The last step does not render a connector.
       * @protected
       */
      _last: {
        type: Boolean,
        value: false,
        attribute: false,
      },

      /**
       * The texts announced to assistive technology, set by the parent
       * `<vaadin-stepper>` from its `i18n` property.
       * @protected
       */
      _i18n: {
        type: Object,
        attribute: false,
        value: () => ({ completed: 'Completed', invalid: 'Error' }),
      },
    };
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
  }

  /** @protected */
  render() {
    const content = html`
      <span part="indicator" aria-hidden="true">${this.__hasIcon() ? nothing : this._position}</span>
      <span part="content">
        <span part="label"><slot></slot></span>
        <span part="description"><slot name="description"></slot></span>
      </span>
      ${this.__renderStateText()}
    `;

    return html`
      ${
        this.path == null
          ? html`<div part="nolink" aria-current="${this.current ? 'step' : nothing}">${content}</div>`
          : html`
              <a
                part="link"
                href="${ifDefined(this.disabled ? undefined : this.path)}"
                tabindex="${this.disabled ? '-1' : '0'}"
                aria-current="${this.current ? 'step' : nothing}"
                >${content}</a
              >
            `
      }
      ${this._last ? nothing : html`<span part="connector" aria-hidden="true"></span>`}
    `;
  }

  /**
   * @param {FocusOptions=} options
   * @protected
   * @override
   */
  focus(options) {
    if (!this.disabled) {
      super.focus(options);
    }
  }

  /**
   * Override method inherited from `FocusMixin`
   * to not set `focused` attribute when disabled.
   *
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldSetFocus() {
    return !this.disabled;
  }

  /** @private */
  __hasIcon() {
    return this.invalid || this.completed;
  }

  /** @private */
  __renderStateText() {
    const i18n = this._i18n || {};
    const text = this.invalid ? i18n.invalid : this.completed ? i18n.completed : null;
    return text ? html`<span class="sr-only">${text}</span>` : nothing;
  }
}

defineCustomElement(Step);

export { Step };
