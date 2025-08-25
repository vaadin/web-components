/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { matchPaths } from '@vaadin/component-base/src/url-utils.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { stepStyles } from './styles/vaadin-step-styles.js';

/**
 * `<vaadin-step>` is a Web Component for displaying a single step in a stepper.
 *
 * ```html
 * <vaadin-step href="/step1">Step 1</vaadin-step>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|----------------
 * `indicator`  | The step indicator (circle with number/icon)
 * `content`    | The content wrapper containing label and description
 * `label`      | The step label
 * `description`| The step description
 * `connector`  | The connector line to the next step
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `disabled`   | Set when the element is disabled
 * `completed`  | Set when the step is completed
 * `error`      | Set when the step has an error
 * `active`     | Set when the step is active
 * `last`       | Set when this is the last step
 * `orientation`| The orientation of the parent stepper (horizontal or vertical)
 * `small`      | Set when using small size variant
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DisabledMixin
 * @mixes DirMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Step extends DisabledMixin(DirMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))))) {
  static get is() {
    return 'vaadin-step';
  }

  static get styles() {
    return stepStyles;
  }

  static get properties() {
    return {
      /**
       * The URL to navigate to
       */
      href: {
        type: String,
      },

      /**
       * The target of the link
       */
      target: {
        type: String,
      },

      /**
       * The label text
       */
      label: {
        type: String,
      },

      /**
       * The description text
       */
      description: {
        type: String,
      },

      /**
       * The state of the step
       * @type {string}
       */
      state: {
        type: String,
        value: 'inactive',
        reflectToAttribute: true,
        observer: '_stateChanged',
      },

      /**
       * Whether to exclude the item from client-side routing
       * @type {boolean}
       * @attr {boolean} router-ignore
       */
      routerIgnore: {
        type: Boolean,
        value: false,
      },

      /**
       * The orientation from parent stepper
       * @type {string}
       * @private
       */
      _orientation: {
        type: String,
        value: 'vertical',
        reflectToAttribute: true,
        attribute: 'orientation',
      },

      /**
       * Whether this is the last step
       * @type {boolean}
       * @private
       */
      _last: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        attribute: 'last',
      },

      /**
       * Whether using small size variant
       * @type {boolean}
       * @private
       */
      _small: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        attribute: 'small',
      },

      /**
       * The step number
       * @type {number}
       * @private
       */
      _stepNumber: {
        type: Number,
        value: 0,
      },

      /**
       * Whether the step's href matches the current page
       * @type {boolean}
       */
      current: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
      },

      /**
       * Whether the step is completed
       * @type {boolean}
       */
      completed: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Whether the step has an error
       * @type {boolean}
       */
      error: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Whether the step is active
       * @type {boolean}
       */
      active: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  constructor() {
    super();
    this.__boundUpdateCurrent = this.__updateCurrent.bind(this);
  }

  /** @protected */
  render() {
    const hasLink = !!this.href;
    const showConnector = !this._last;

    return html`
      ${hasLink
        ? html`
            <a
              href="${ifDefined(this.href)}"
              target="${ifDefined(this.target)}"
              ?router-ignore="${this.routerIgnore}"
              aria-current="${this.current ? 'step' : 'false'}"
              tabindex="${this.disabled ? '-1' : '0'}"
            >
              ${this._renderContent()}
            </a>
          `
        : html` <div aria-current="${this.active ? 'step' : 'false'}">${this._renderContent()}</div> `}
      ${showConnector ? html`<span part="connector" aria-hidden="true"></span>` : ''}
    `;
  }

  /** @private */
  _renderContent() {
    return html`
      <span part="indicator" aria-hidden="true">
        ${this.completed
          ? html`<span class="checkmark">✓</span>`
          : this.error
            ? html`<span class="error-icon">!</span>`
            : html`<span class="step-number">${this._stepNumber}</span>`}
      </span>
      <span part="content">
        <span part="label">${this.label || html`<slot name="label"></slot>`}</span>
        ${this.description ? html`<span part="description">${this.description}</span>` : ''}
      </span>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('href')) {
      this.__updateCurrent();
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__updateCurrent();

    window.addEventListener('popstate', this.__boundUpdateCurrent);
    window.addEventListener('vaadin-navigated', this.__boundUpdateCurrent);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('popstate', this.__boundUpdateCurrent);
    window.removeEventListener('vaadin-navigated', this.__boundUpdateCurrent);
  }

  /**
   * @param {boolean} last
   * @private
   */
  _setLast(last) {
    this._last = last;
  }

  /**
   * @param {string} orientation
   * @private
   */
  _setOrientation(orientation) {
    this._orientation = orientation;
  }

  /**
   * @param {boolean} small
   * @private
   */
  _setSmall(small) {
    this._small = small;
  }

  /**
   * @param {number} stepNumber
   * @private
   */
  _setStepNumber(stepNumber) {
    this._stepNumber = stepNumber;
  }

  /** @private */
  _stateChanged() {
    this._updateStateAttributes();
  }

  /** @private */
  __updateCurrent() {
    if (!this.href) {
      this._setCurrent(false);
      return;
    }

    const browserPath = `${location.pathname}${location.search}`;
    const isCurrent = matchPaths(browserPath, this.href);
    this._setCurrent(isCurrent);

    // Set active state if current
    if (isCurrent) {
      this.active = true;
      this.completed = false;
      this.error = false;
    }
  }

  /** @private */
  _updateStateAttributes() {
    // Clear all states first
    this.active = false;
    this.completed = false;
    this.error = false;

    // Set the appropriate state
    switch (this.state) {
      case 'active':
        this.active = true;
        break;
      case 'completed':
        this.completed = true;
        break;
      case 'error':
        this.error = true;
        break;
      default:
        // inactive state - all flags remain false
        break;
    }
  }
}

defineCustomElement(Step);

export { Step };
