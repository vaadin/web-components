/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotMixin } from '@vaadin/component-base/src/slot-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export interface SelectItem {
  label?: string;
  value?: string;
  component?: string;
  disabled?: boolean;
}

/**
 * Fired when the user commits a value change.
 */
export type SelectChangeEvent = Event & {
  target: Select;
};

/**
 * Function for rendering the content of the `<vaadin-select>`.
 * Receives two arguments:
 *
 * - `root` The `<vaadin-select-overlay>` internal container
 *   DOM element. Append your content to it.
 * - `select` The reference to the `<vaadin-select>` element.
 */
export type SelectRenderer = (root: HTMLElement, select?: Select) => void;

/**
 * Fired when the `opened` property changes.
 */
export type SelectOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type SelectInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type SelectValueChangedEvent = CustomEvent<{ value: string }>;

export interface SelectCustomEventMap {
  'opened-changed': SelectOpenedChangedEvent;

  'invalid-changed': SelectInvalidChangedEvent;

  'value-changed': SelectValueChangedEvent;
}

export interface SelectEventMap extends HTMLElementEventMap, SelectCustomEventMap {
  change: SelectChangeEvent;
}

/**
 * `<vaadin-select>` is a Web Component for selecting values from a list of items.
 *
 * ### Items
 *
 * Use the `items` property to define possible options for the select:
 *
 * ```html
 * <vaadin-select id="select"></vaadin-select>
 * ```
 * ```js
 * const select = document.querySelector('#select');
 * select.items = [
 *   { label: 'Most recent first', value: 'recent' },
 *   { component: 'hr' },
 *   { label: 'Rating: low to high', value: 'rating-asc' },
 *   { label: 'Rating: high to low', value: 'rating-desc' },
 *   { component: 'hr' },
 *   { label: 'Price: low to high', value: 'price-asc', disabled: true },
 *   { label: 'Price: high to low', value: 'price-desc', disabled: true }
 * ];
 * ```
 *
 * ### Rendering
 *
 * Alternatively, the content of the select can be populated by using the renderer callback function.
 *
 * The renderer function provides `root`, `select` arguments.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `select`.
 *
 * ```js
 * const select = document.querySelector('#select');
 * select.renderer = function(root, select) {
 *   const listBox = document.createElement('vaadin-list-box');
 *   // append 3 <vaadin-item> elements
 *   ['Jose', 'Manolo', 'Pedro'].forEach(function(name) {
 *     const item = document.createElement('vaadin-item');
 *     item.textContent = name;
 *     item.setAttribute('label', name)
 *     listBox.appendChild(item);
 *   });
 *
 *   // update the content
 *   root.appendChild(listBox);
 * };
 * ```
 *
 * Renderer is called on initialization of new select and on its opening.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * * Hint: By setting the `label` property of inner vaadin-items you will
 * be able to change the visual representation of the selected value in the input part.
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property                    | Description                  | Target element          | Default
 * -----------------------------------|------------------------------|----------------------------------
 * `--vaadin-field-default-width`     | Default width of the field   | :host                   | `12em`
 * `--vaadin-select-text-field-width` | Effective width of the field | `vaadin-select-overlay` |
 *
 * `<vaadin-select>` provides mostly the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name       | Description
 * ----------------|----------------
 * `toggle-button` | The toggle button
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute | Description                 | Part name
 * ----------|-----------------------------|-----------
 * `opened`  | Set when the select is open | :host
 *
 * There are two exceptions in terms of styling compared to `<vaadin-text-field>`:
 * - the `clear-button` shadow DOM part does not exist in `<vaadin-select>`.
 * - the `input-prevented` state attribute is not supported by `<vaadin-select>`.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-select>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-select-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - `<vaadin-select-value-button>` - has the same API as [`<vaadin-button>`](#/elements/vaadin-button).
 * - [`<vaadin-input-container>`](#/elements/vaadin-input-container) - an internal element wrapping the button.
 *
 * Note: the `theme` attribute value set on `<vaadin-select>` is
 * propagated to the internal components listed above.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class Select extends DelegateFocusMixin(FieldMixin(SlotMixin(ElementMixin(ThemableMixin(HTMLElement))))) {
  /**
   * An array containing items that will be rendered as the options of the select.
   *
   * #### Example
   * ```js
   * select.items = [
   *   { label: 'Most recent first', value: 'recent' },
   *   { component: 'hr' },
   *   { label: 'Rating: low to high', value: 'rating-asc' },
   *   { label: 'Rating: high to low', value: 'rating-desc' },
   *   { component: 'hr' },
   *   { label: 'Price: low to high', value: 'price-asc', disabled: true },
   *   { label: 'Price: high to low', value: 'price-desc', disabled: true }
   * ];
   * ```
   *
   * Note: each item is rendered by default as the internal `<vaadin-select-item>` that is an extension of `<vaadin-item>`.
   * To render the item with a custom component, provide a tag name by the `component` property.
   *
   * @type {!Array<!SelectItem>}
   */
  items: SelectItem[] | null | undefined;

  /**
   * Set when the select is open
   */
  opened: boolean;

  /**
   * Custom function for rendering the content of the `<vaadin-select>`.
   * Receives two arguments:
   *
   * - `root` The `<vaadin-select-overlay>` internal container
   *   DOM element. Append your content to it.
   * - `select` The reference to the `<vaadin-select>` element.
   */
  renderer: SelectRenderer | undefined;

  /**
   * It stores the the `value` property of the selected item, providing the
   * value for iron-form.
   * When there’s an item selected, it's the value of that item, otherwise
   * it's an empty string.
   * On change or initialization, the component finds the item which matches the
   * value and displays it.
   * If no value is provided to the component, it selects the first item without
   * value or empty value.
   * Hint: If you do not want to select any item by default, you can either set all
   * the values of inner vaadin-items, or set the vaadin-select value to
   * an inexistent value in the items list.
   */
  value: string;

  /**
   * The name of this element.
   */
  name: string | null | undefined;

  /**
   * A hint to the user of what can be entered in the control.
   * The placeholder will be displayed in the case that there
   * is no item selected, or the selected item has an empty
   * string label, or the selected item has no label and it's
   * DOM content is empty.
   */
  placeholder: string | null | undefined;

  /**
   * When present, it specifies that the element is read-only.
   */
  readonly: boolean;

  /**
   * Requests an update for the content of the select.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  addEventListener<K extends keyof SelectEventMap>(
    type: K,
    listener: (this: Select, ev: SelectEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof SelectEventMap>(
    type: K,
    listener: (this: Select, ev: SelectEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-select': Select;
  }
}

export { Select };
