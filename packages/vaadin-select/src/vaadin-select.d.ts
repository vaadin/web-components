import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { SelectEventMap, SelectRenderer } from './interfaces';

/**
 * `<vaadin-select>` is a Web Component for selecting values from a list of items. The content of the
 * the select can be populated in two ways: imperatively by using renderer callback function and
 * declaratively by using Polymer's Templates.
 *
 * ### Rendering
 *
 * By default, the select uses the content provided by using the renderer callback function.
 *
 * The renderer function provides `root`, `select` arguments.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `select`.
 *
 * ```html
 * <vaadin-select id="select"></vaadin-select>
 * ```
 * ```js
 * const select = document.querySelector('#select');
 * select.renderer = function(root, select) {
 *   const listBox = document.createElement('vaadin-list-box');
 *   // append 3 <vaadin-item> elements
 *   ['Jose', 'Manolo', 'Pedro'].forEach(function(name) {
 *     const item = document.createElement('vaadin-item');
 *     item.textContent = name;
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
 * ### Polymer Templates
 *
 * Alternatively, the content can be provided with Polymer's Template.
 * Select finds the first child template and uses that in case renderer callback function
 * is not provided. You can also set a custom template using the `template` property.
 *
 * ```
 * <vaadin-select>
 *   <template>
 *     <vaadin-list-box>
 *       <vaadin-item label="foo">Foo</vaadin-item>
 *       <vaadin-item>Bar</vaadin-item>
 *       <vaadin-item>Baz</vaadin-item>
 *     </vaadin-list-box>
 *   </template>
 * </vaadin-select>
 * ```
 *
 * Hint: By setting the `label` property of inner vaadin-items you will
 * be able to change the visual representation of the selected value in the input part.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `toggle-button` | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `opened` | Set when the select is open | :host
 * `invalid` | Set when the element is invalid | :host
 * `focused` | Set when the element is focused | :host
 * `focus-ring` | Set when the element is keyboard focused | :host
 * `readonly` | Set when the select is read only | :host
 *
 * `<vaadin-select>` element sets these custom CSS properties:
 *
 * Property name | Description | Theme for element
 * --- | --- | ---
 * `--vaadin-select-text-field-width` | Width of the select text field | `vaadin-select-overlay`
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * In addition to `<vaadin-select>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-select-text-field>`
 * - `<vaadin-select-overlay>`
 *
 * Note: the `theme` attribute value set on `<vaadin-select>` is
 * propagated to the internal themable components listed above.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class SelectElement extends ElementMixin(ControlStateMixin(ThemableMixin(HTMLElement))) {
  readonly focusElement: HTMLElement;

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
   * The error message to display when the select value is invalid
   */
  errorMessage: string;

  /**
   * String used for the label element.
   */
  label: string | null | undefined;

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
   * The current required state of the select. True if required.
   */
  required: boolean | null | undefined;

  /**
   * Set to true if the value is invalid.
   */
  invalid: boolean;

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
   * String used for the helper text.
   */
  helperText: string | null | undefined;

  /**
   * When present, it specifies that the element is read-only.
   */
  readonly: boolean;

  _setFocused(focused: boolean): void;

  ready(): void;

  /**
   * Manually invoke existing renderer.
   */
  render(): void;

  _onKeyDown(e: KeyboardEvent): void;

  _onKeyDownInside(e: KeyboardEvent): void;

  /**
   * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
   *
   * @returns True if the value is valid and sets the `invalid` flag appropriately
   */
  validate(): boolean;

  addEventListener<K extends keyof SelectEventMap>(
    type: K,
    listener: (this: SelectElement, ev: SelectEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof SelectEventMap>(
    type: K,
    listener: (this: SelectElement, ev: SelectEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-select': SelectElement;
  }
}

export { SelectElement };
