/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusMixinClass } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { DelegateStateMixinClass } from '@vaadin/field-base/src/delegate-state-mixin.js';
import { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import { PatternMixinClass } from '@vaadin/field-base/src/pattern-mixin.js';
import { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxDataProviderMixinClass } from './vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxMixinClass } from './vaadin-combo-box-mixin.js';
import { ComboBoxDefaultItem } from './vaadin-combo-box-mixin.js';
export {
  ComboBoxDataProvider,
  ComboBoxDataProviderCallback,
  ComboBoxDataProviderParams
} from './vaadin-combo-box-data-provider-mixin.js';
export { ComboBoxDefaultItem, ComboBoxItemModel, ComboBoxRenderer } from './vaadin-combo-box-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type ComboBoxChangeEvent<TItem> = Event & {
  target: ComboBox<TItem>;
};

/**
 * Fired when the user sets a custom value.
 */
export type ComboBoxCustomValueSetEvent = CustomEvent<string>;

/**
 * Fired when the `opened` property changes.
 */
export type ComboBoxOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type ComboBoxInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type ComboBoxValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `filter` property changes.
 */
export type ComboBoxFilterChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `selectedItem` property changes.
 */
export type ComboBoxSelectedItemChangedEvent<TItem> = CustomEvent<{ value: TItem | null | undefined }>;

export interface ComboBoxEventMap<TItem> extends HTMLElementEventMap {
  change: ComboBoxChangeEvent<TItem>;

  'custom-value-set': ComboBoxCustomValueSetEvent;

  'opened-changed': ComboBoxOpenedChangedEvent;

  'filter-changed': ComboBoxFilterChangedEvent;

  'invalid-changed': ComboBoxInvalidChangedEvent;

  'value-changed': ComboBoxValueChangedEvent;

  'selected-item-changed': ComboBoxSelectedItemChangedEvent<TItem>;
}

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
 * Custom property                         | Description                | Default
 * ----------------------------------------|----------------------------|---------
 * `--vaadin-field-default-width`          | Default width of the field | `12em`
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
 * If you want to replace the default `<input>` and its container with a custom implementation to get full control
 * over the input field, consider using the [`<vaadin-combo-box-light>`](#/elements/vaadin-combo-box-light) element.
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
declare class ComboBox<TItem = ComboBoxDefaultItem> extends HTMLElement {
  addEventListener<K extends keyof ComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: ComboBox<TItem>, ev: ComboBoxEventMap<TItem>[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof ComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: ComboBox<TItem>, ev: ComboBoxEventMap<TItem>[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

interface ComboBox<TItem = ComboBoxDefaultItem>
  extends ComboBoxDataProviderMixinClass<TItem>,
    ComboBoxMixinClass<TItem>,
    ValidateMixinClass,
    PatternMixinClass,
    LabelMixinClass,
    KeyboardMixinClass,
    InputMixinClass,
    InputControlMixinClass,
    InputConstraintsMixinClass,
    FocusMixinClass,
    FieldMixinClass,
    DisabledMixinClass,
    DelegateStateMixinClass,
    DelegateFocusMixinClass,
    ThemableMixinClass,
    ElementMixinClass,
    ControllerMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-combo-box': ComboBox;
  }
}

export { ComboBox };
