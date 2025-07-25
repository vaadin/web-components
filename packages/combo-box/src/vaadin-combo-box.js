/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import './vaadin-combo-box-item.js';
import './vaadin-combo-box-overlay.js';
import './vaadin-combo-box-scroller.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { comboBoxStyles } from './styles/vaadin-combo-box-core-styles.js';
import { ComboBoxDataProviderMixin } from './vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';

/**
 * `<vaadin-combo-box>` is a web component for choosing a value from a filterable list of options
 * presented in a dropdown overlay. The options can be provided as a list of strings or objects
 * by setting [`items`](#/elements/vaadin-combo-box#property-items) property on the element.
 *
 * ```html
 * <vaadin-combo-box id="combo-box"></vaadin-combo-box>
 * ```
 *
 * ```js
 * document.querySelector('#combo-box').items = ['apple', 'orange', 'banana'];
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Item rendering
 *
 * To customize the content of the `<vaadin-combo-box-item>` elements placed in the dropdown, use
 * [`renderer`](#/elements/vaadin-combo-box#property-renderer) property which accepts a function.
 * The renderer function is called with `root`, `comboBox`, and `model` as arguments.
 *
 * Generate DOM content by using `model` object properties if needed, and append it to the `root`
 * element. The `comboBox` reference is provided to access the combo-box element state. Do not
 * set combo-box properties in a `renderer` function.
 *
 * ```js
 * const comboBox = document.querySelector('#combo-box');
 * comboBox.items = [{'label': 'Hydrogen', 'value': 'H'}];
 * comboBox.renderer = (root, comboBox, model) => {
 *   const item = model.item;
 *   root.innerHTML = `${model.index}: ${item.label} <b>${item.value}</b>`;
 * };
 * ```
 *
 * Renderer is called on the opening of the combo-box and each time the related model is updated.
 * Before creating new content, it is recommended to check if there is already an existing DOM
 * element in `root` from a previous renderer call for reusing it. Even though combo-box uses
 * infinite scrolling, reducing DOM operations might improve performance.
 *
 * The following properties are available in the `model` argument:
 *
 * Property   | Type             | Description
 * -----------|------------------|-------------
 * `index`    | Number           | Index of the item in the `items` array
 * `item`     | String or Object | The item reference
 * `selected` | Boolean          | True when item is selected
 * `focused`  | Boolean          | True when item is focused
 *
 * ### Lazy Loading with Function Data Provider
 *
 * In addition to assigning an array to the items property, you can alternatively use the
 * [`dataProvider`](#/elements/vaadin-combo-box#property-dataProvider) function property.
 * The `<vaadin-combo-box>` calls this function lazily, only when it needs more data
 * to be displayed.
 *
 * __Note that when using function data providers, the total number of items
 * needs to be set manually. The total number of items can be returned
 * in the second argument of the data provider callback:__
 *
 * ```js
 * comboBox.dataProvider = async (params, callback) => {
 *   const API = 'https://demo.vaadin.com/demo-data/1.0/filtered-countries';
 *   const { filter, page, pageSize } = params;
 *   const index = page * pageSize;
 *
 *   const res = await fetch(`${API}?index=${index}&count=${pageSize}&filter=${filter}`);
 *   if (res.ok) {
 *     const { result, size } = await res.json();
 *     callback(result, size);
 *   }
 * };
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property                         | Description                | Default
 * ----------------------------------------|----------------------------|---------
 * `--vaadin-field-default-width`          | Default width of the field | `12em`
 * `--vaadin-combo-box-overlay-width`      | Width of the overlay       | `auto`
 * `--vaadin-combo-box-overlay-max-height` | Max height of the overlay  | `65vh`
 *
 * `<vaadin-combo-box>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name       | Description
 * ----------------|----------------
 * `toggle-button` | The toggle button
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute | Description | Part name
 * ----------|-------------|------------
 * `opened`  | Set when the combo box dropdown is open | :host
 * `loading` | Set when new items are expected | :host
 *
 * ### Internal components
 *
 * In addition to `<vaadin-combo-box>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-combo-box-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - `<vaadin-combo-box-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - [`<vaadin-input-container>`](#/elements/vaadin-input-container) - an internal element wrapping the input.
 *
 * Note: the `theme` attribute value set on `<vaadin-combo-box>` is
 * propagated to the internal components listed above.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-value-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} selected-item-changed - Fired when the `selectedItem` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes InputControlMixin
 * @mixes PatternMixin
 * @mixes ComboBoxDataProviderMixin
 * @mixes ComboBoxMixin
 */
class ComboBox extends ComboBoxDataProviderMixin(
  ComboBoxMixin(
    PatternMixin(InputControlMixin(ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))))),
  ),
) {
  static get is() {
    return 'vaadin-combo-box';
  }

  static get styles() {
    return [inputFieldShared, comboBoxStyles];
  }

  static get properties() {
    return {
      /**
       * @protected
       */
      _positionTarget: {
        type: Object,
      },
    };
  }

  /**
   * Used by `InputControlMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-combo-box-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          .readonly="${this.readonly}"
          .disabled="${this.disabled}"
          .invalid="${this.invalid}"
          theme="${ifDefined(this._theme)}"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
          <div id="toggleButton" part="toggle-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <vaadin-combo-box-overlay
        id="overlay"
        .owner="${this}"
        .opened="${this._overlayOpened}"
        ?loading="${this.loading}"
        theme="${ifDefined(this._theme)}"
        .positionTarget="${this._positionTarget}"
        no-vertical-overlap
      ></vaadin-combo-box-overlay>

      <slot name="tooltip"></slot>
    `;
  }

  /** @protected */
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
    this.addController(new LabelledInputController(this.inputElement, this._labelController));

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
    this._tooltipController.setPosition('top');
    this._tooltipController.setAriaTarget(this.inputElement);
    this._tooltipController.setShouldShow((target) => !target.opened);

    this._positionTarget = this.shadowRoot.querySelector('[part="input-field"]');
    this._toggleElement = this.$.toggleButton;
  }

  /**
   * Override the method from `InputControlMixin`
   * to stop event propagation to prevent `ComboBoxMixin`
   * from handling this click event also on its own.
   *
   * @param {Event} event
   * @protected
   * @override
   */
  _onClearButtonClick(event) {
    event.stopPropagation();
    super._onClearButtonClick(event);
  }

  /**
   * @param {Event} event
   * @protected
   */
  _onHostClick(event) {
    const path = event.composedPath();

    // Open dropdown only when clicking on the label or input field
    if (path.includes(this._labelNode) || path.includes(this._positionTarget)) {
      super._onHostClick(event);
    }
  }
}

defineCustomElement(ComboBox);

export { ComboBox };
