import { TextFieldElement } from '@vaadin/vaadin-text-field/vaadin-text-field';

import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin';

import { ComboBoxMixin } from './vaadin-combo-box-mixin';

import { ComboBoxDataProviderMixin } from './vaadin-combo-box-data-provider-mixin';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin';

import { ComboBoxDefaultItem, ComboBoxEventMap } from './interfaces';

/**
 * `<vaadin-combo-box>` is a combo box element combining a dropdown list with an
 * input field for filtering the list of items. If you want to replace the default
 * input field with a custom implementation, you should use the
 * [`<vaadin-combo-box-light>`](#/elements/vaadin-combo-box-light) element.
 *
 * Items in the dropdown list must be provided as a list of `String` values.
 * Defining the items is done using the `items` property, which can be assigned
 * with data-binding, using an attribute or directly with the JavaScript property.
 *
 * ```html
 * <vaadin-combo-box
 *     label="Fruit"
 *     items="[[data]]">
 * </vaadin-combo-box>
 * ```
 *
 * ```js
 * combobox.items = ['apple', 'orange', 'banana'];
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Item rendering
 *
 * `<vaadin-combo-box>` supports using custom renderer callback function for defining the
 * content of `<vaadin-combo-box-item>`.
 *
 * The renderer function provides `root`, `comboBox`, `model` arguments when applicable.
 * Generate DOM content by using `model` object properties if needed, append it to the `root`
 * element and control the state of the host element by accessing `comboBox`. Before generating new
 * content, users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-combo-box id="combo-box"></vaadin-combo-box>
 * ```
 * ```js
 * const comboBox = document.querySelector('#combo-box');
 * comboBox.items = [{'label': 'Hydrogen', 'value': 'H'}];
 * comboBox.renderer = function(root, comboBox, model) {
 *   root.innerHTML = model.index + ': ' +
 *                    model.item.label + ' ' +
 *                    '<b>' + model.item.value + '</b>';
 * };
 * ```
 *
 * Renderer is called on the opening of the combo-box and each time the related model is updated.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * The following properties are available in the `model` argument:
 *
 * Property name | Type | Description
 * --------------|------|------------
 * `index`| Number | Index of the item in the `items` array
 * `item` | String or Object | The item reference
 * `selected` | Boolean | True when item is selected
 * `focused` | Boolean | True when item is focused
 *
 * ### Lazy Loading with Function Data Provider
 *
 * In addition to assigning an array to the items property, you can alternatively
 * provide the `<vaadin-combo-box>` data through the
 * [`dataProvider`](#/elements/vaadin-combo-box#property-dataProvider) function property.
 * The `<vaadin-combo-box>` calls this function lazily, only when it needs more data
 * to be displayed.
 *
 * See the [`dataProvider`](#/elements/vaadin-combo-box#property-dataProvider) in
 * the API reference below for the detailed data provider arguments description,
 * and the “Lazy Loading“ example on “Basics” page in the demos.
 *
 * __Note that when using function data providers, the total number of items
 * needs to be set manually. The total number of items can be returned
 * in the second argument of the data provider callback:__
 *
 * ```javascript
 * comboBox.dataProvider = function(params, callback) {
 *   var url = 'https://api.example/data' +
 *       '?page=' + params.page +        // the requested page index
 *       '&per_page=' + params.pageSize; // number of items on the page
 *   var xhr = new XMLHttpRequest();
 *   xhr.onload = function() {
 *     var response = JSON.parse(xhr.responseText);
 *     callback(
 *       response.employees, // requested page of items
 *       response.totalSize  // total number of items
 *     );
 *   };
 *   xhr.open('GET', url, true);
 *   xhr.send();
 * };
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 * `--vaadin-combo-box-overlay-max-height` | Property that determines the max height of overlay | `65vh`
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `text-field` | The text field
 * `toggle-button` | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `opened` | Set when the combo box dropdown is open | :host
 * `disabled` | Set to a disabled combo box | :host
 * `readonly` | Set to a read only combo box | :host
 * `has-value` | Set when the element has a value | :host
 * `invalid` | Set when the element is invalid | :host
 * `focused` | Set when the element is focused | :host
 * `focus-ring` | Set when the element is keyboard focused | :host
 * `loading` | Set when new items are expected | :host
 *
 * ### Internal components
 *
 * In addition to `<vaadin-combo-box>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-combo-box-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - [`<vaadin-text-field>`](#/elements/vaadin-text-field)
 * - `<vaadin-combo-box-item>`
 *
 * Note: the `theme` attribute value set on `<vaadin-combo-box>` is
 * propagated to the internal components listed above.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-value-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} selected-item-changed - Fired when the `selectedItem` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class ComboBoxElement<TItem = ComboBoxDefaultItem> extends HTMLElement {
  /**
   * Focusable element used by vaadin-control-state-mixin
   */
  readonly focusElement: HTMLElement;

  autofocus: boolean;

  /**
   * Set to true to disable this input.
   */
  disabled: boolean;

  /**
   * Set to true to prevent the user from picking a value or typing in the input.
   */
  readonly: boolean;

  readonly inputElement: TextFieldElement | undefined;

  /**
   * The label for this element.
   */
  label: string | null | undefined;

  /**
   * Set to true to mark the input as required.
   */
  required: boolean;

  /**
   * Set to true to prevent the user from entering invalid input.
   * @attr {boolean} prevent-invalid-input
   */
  preventInvalidInput: boolean | null | undefined;

  /**
   * A pattern to validate the `input` with.
   */
  pattern: string | null | undefined;

  /**
   * The error message to display when the input is invalid.
   * @attr {string} error-message
   */
  errorMessage: string | null | undefined;

  /**
   * A placeholder string in addition to the label.
   */
  placeholder: string;

  /**
   * String used for the helper text.
   * @attr {string} helper-text
   */
  helperText: string | null | undefined;

  /**
   * Set to true to display the clear icon which clears the input.
   * @attr {boolean} clear-button-visible
   */
  clearButtonVisible: boolean;

  addEventListener<K extends keyof ComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: ComboBoxElement<TItem>, ev: ComboBoxEventMap<TItem>[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof ComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: ComboBoxElement<TItem>, ev: ComboBoxEventMap<TItem>[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

interface ComboBoxElement<TItem = ComboBoxDefaultItem>
  extends ElementMixin,
    ControlStateMixin,
    ComboBoxDataProviderMixin<TItem>,
    ComboBoxMixin<TItem>,
    ThemableMixin {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-combo-box': ComboBoxElement;
  }
}

export { ComboBoxElement };
