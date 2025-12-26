/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-step.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { stepperStyles } from './styles/vaadin-stepper-styles.js';

/**
 * `<vaadin-stepper>` is a Web Component for displaying a step-by-step process.
 *
 * ```html
 * <vaadin-stepper>
 *   <vaadin-step href="/step1">Step 1</vaadin-step>
 *   <vaadin-step href="/step2">Step 2</vaadin-step>
 *   <vaadin-step>Step 3</vaadin-step>
 * </vaadin-stepper>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|----------------
 * `list`     | The ordered list element containing steps
 *
 * The following attributes are available for styling:
 *
 * Attribute     | Description
 * --------------|-------------
 * `orientation` | The orientation of the stepper (horizontal or vertical)
 * `theme`       | Can be set to `small` for compact size
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Stepper extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-stepper';
  }

  static get styles() {
    return stepperStyles;
  }

  static get properties() {
    return {
      /**
       * The orientation of the stepper
       * @type {string}
       * @attr {string} orientation
       */
      orientation: {
        type: String,
        value: 'vertical',
        reflectToAttribute: true,
      },

      /**
       * The list of steps
       * @type {!Array<!Step>}
       * @private
       */
      _steps: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this._steps = [];
  }

  /** @protected */
  render() {
    return html`
      <nav part="nav" role="navigation">
        <ol part="list" role="list">
          <slot @slotchange="${this._onSlotChange}"></slot>
        </ol>
      </nav>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'navigation');
    }

    this.setAttribute('aria-label', 'Progress');
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('orientation')) {
      this._updateStepsOrientation();
    }
  }

  /** @private */
  _onSlotChange() {
    const slot = this.shadowRoot.querySelector('slot');
    const steps = slot.assignedElements().filter((el) => el.localName === 'vaadin-step');

    this._steps = steps;

    // Update step properties
    steps.forEach((step, index) => {
      const isLast = index === steps.length - 1;
      step._setLast(isLast);
      step._setStepNumber(index + 1);
      step._setOrientation(this.orientation);

      // Check if step has small theme
      const theme = this.getAttribute('theme');
      const hasSmallTheme = theme && theme.includes('small');
      step._setSmall(hasSmallTheme);
    });
  }

  /** @private */
  _updateStepsOrientation() {
    if (this._steps) {
      this._steps.forEach((step) => {
        step._setOrientation(this.orientation);
      });
    }
  }

  /**
   * Sets the state of a specific step
   * @param {string} state - The state to set ('active', 'completed', 'error', 'inactive')
   * @param {number} stepIndex - The index of the step to update
   */
  setStepState(state, stepIndex) {
    if (this._steps && this._steps[stepIndex]) {
      this._steps[stepIndex].state = state;
      this._steps[stepIndex].requestUpdate();
    }
  }

  /**
   * Marks steps up to the specified index as completed
   * @param {number} untilIndex - Complete steps up to this index (exclusive)
   */
  completeStepsUntil(untilIndex) {
    if (this._steps) {
      this._steps.forEach((step, index) => {
        if (index < untilIndex) {
          step.state = 'completed';
        }
      });
    }
  }

  /**
   * Gets the current active step
   * @return {Step|null} The active step or null if none is active
   */
  getActiveStep() {
    return this._steps.find((step) => step.active) || null;
  }

  /**
   * Resets all steps to inactive state
   */
  reset() {
    if (this._steps) {
      this._steps.forEach((step) => {
        step.state = 'inactive';
      });
    }
  }
}

defineCustomElement(Stepper);

export { Stepper };
