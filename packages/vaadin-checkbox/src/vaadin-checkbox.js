/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * `<vaadin-checkbox>` is a Web Component for customized checkboxes.
 *
 * ```html
 * <vaadin-checkbox>
 *   Make my profile visible
 * </vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|----------------
 * `checkbox`        | The wrapper element for the native <input type="checkbox">
 * `label`           | The wrapper element in which the component's children, namely the label, is slotted
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|--------------
 * `active`     | Set when the checkbox is pressed down, either with mouse, touch or the keyboard. | `:host`
 * `disabled`   | Set when the checkbox is disabled. | `:host`
 * `focus-ring` | Set when the checkbox is focused using the keyboard. | `:host`
 * `focused`    | Set when the checkbox is focused. | `:host`
 * `indeterminate` | Set when the checkbox is in indeterminate mode. | `:host`
 * `checked` | Set when the checkbox is checked. | `:host`
 * `empty` | Set when there is no label provided. | `label`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} indeterminate-changed - Fired when the `indeterminate` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControlStateMixin
 * @mixes ThemableMixin
 * @mixes GestureEventListeners
 */
class CheckboxElement extends ElementMixin(ControlStateMixin(ThemableMixin(GestureEventListeners(PolymerElement)))) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        label {
          display: inline-flex;
          align-items: baseline;
          outline: none;
        }

        [part='checkbox'] {
          position: relative;
          display: inline-block;
          flex: none;
        }

        input[type='checkbox'] {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: inherit;
          margin: 0;
        }

        :host([disabled]) {
          -webkit-tap-highlight-color: transparent;
        }
      </style>

      <label>
        <span part="checkbox">
          <input
            type="checkbox"
            checked="{{checked::change}}"
            disabled$="[[disabled]]"
            indeterminate="{{indeterminate::change}}"
            role="presentation"
            tabindex="-1"
          />
        </span>

        <span part="label">
          <slot></slot>
        </span>
      </label>
    `;
  }

  static get is() {
    return 'vaadin-checkbox';
  }

  static get version() {
    return '22.0.0-alpha0';
  }

  static get properties() {
    return {
      /**
       * True if the checkbox is checked.
       * @type {boolean}
       */
      checked: {
        type: Boolean,
        value: false,
        notify: true,
        observer: '_checkedChanged',
        reflectToAttribute: true
      },

      /**
       * Indeterminate state of the checkbox when it's neither checked nor unchecked, but undetermined.
       * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
       * @type {boolean}
       */
      indeterminate: {
        type: Boolean,
        notify: true,
        observer: '_indeterminateChanged',
        reflectToAttribute: true,
        value: false
      },

      /**
       * The value given to the data submitted with the checkbox's name to the server when the control is inside a form.
       */
      value: {
        type: String,
        value: 'on'
      },

      /** @private */
      _nativeCheckbox: {
        type: Object
      }
    };
  }

  constructor() {
    super();
    /**
     * @type {string}
     * Name of the element.
     */
    this.name;
  }

  get name() {
    return this.checked ? this._storedName : '';
  }

  set name(name) {
    this._storedName = name;
  }

  ready() {
    super.ready();

    this.setAttribute('role', 'checkbox');

    this._nativeCheckbox = this.shadowRoot.querySelector('input[type="checkbox"]');

    this.addEventListener('click', this._handleClick.bind(this));

    this._addActiveListeners();

    const attrName = this.getAttribute('name');
    if (attrName) {
      this.name = attrName;
    }

    this.shadowRoot
      .querySelector('[part~="label"]')
      .querySelector('slot')
      .addEventListener('slotchange', this._updateLabelAttribute.bind(this));

    this._updateLabelAttribute();
  }

  /** @private */
  _updateLabelAttribute() {
    const label = this.shadowRoot.querySelector('[part~="label"]');
    const assignedNodes = label.firstElementChild.assignedNodes();
    if (this._isAssignedNodesEmpty(assignedNodes)) {
      label.setAttribute('empty', '');
    } else {
      label.removeAttribute('empty');
    }
  }

  /** @private */
  _isAssignedNodesEmpty(nodes) {
    // The assigned nodes considered to be empty if there is no slotted content or only one empty text node
    return (
      nodes.length === 0 ||
      (nodes.length == 1 && nodes[0].nodeType == Node.TEXT_NODE && nodes[0].textContent.trim() === '')
    );
  }

  /** @private */
  _checkedChanged(checked) {
    if (this.indeterminate) {
      this.setAttribute('aria-checked', 'mixed');
    } else {
      this.setAttribute('aria-checked', Boolean(checked));
    }
  }

  /** @private */
  _indeterminateChanged(indeterminate) {
    if (indeterminate) {
      this.setAttribute('aria-checked', 'mixed');
    } else {
      this.setAttribute('aria-checked', this.checked);
    }
  }

  /** @private */
  _addActiveListeners() {
    // DOWN
    this._addEventListenerToNode(this, 'down', (e) => {
      if (this.__interactionsAllowed(e)) {
        this.setAttribute('active', '');
      }
    });

    // UP
    this._addEventListenerToNode(this, 'up', () => this.removeAttribute('active'));

    // KEYDOWN
    this.addEventListener('keydown', (e) => {
      if (this.__interactionsAllowed(e) && e.keyCode === 32) {
        e.preventDefault();
        this.setAttribute('active', '');
      }
    });

    // KEYUP
    this.addEventListener('keyup', (e) => {
      if (this.__interactionsAllowed(e) && e.keyCode === 32) {
        e.preventDefault();
        this._toggleChecked();
        this.removeAttribute('active');

        if (this.indeterminate) {
          this.indeterminate = false;
        }
      }
    });
  }

  /**
   * @return {!HTMLInputElement}
   * @protected
   */
  get focusElement() {
    return this.shadowRoot.querySelector('input');
  }

  /**
   * True if users' interactions (mouse or keyboard)
   * should toggle the checkbox
   */
  __interactionsAllowed(e) {
    if (this.disabled) {
      return false;
    }

    // https://github.com/vaadin/vaadin-checkbox/issues/63
    if (e.target.localName === 'a') {
      return false;
    }

    return true;
  }

  /** @private */
  _handleClick(e) {
    if (this.__interactionsAllowed(e)) {
      if (!this.indeterminate) {
        if (e.composedPath()[0] !== this._nativeCheckbox) {
          e.preventDefault();
          this._toggleChecked();
        }
      } else {
        /*
         * Required for IE 11 and Edge.
         * See issue here: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7344418/
         */
        this.indeterminate = false;
        e.preventDefault();
        this._toggleChecked();
      }
    }
  }

  /** @protected */
  _toggleChecked() {
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('change', { composed: false, bubbles: true }));
  }

  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}

customElements.define(CheckboxElement.is, CheckboxElement);

export { CheckboxElement };
