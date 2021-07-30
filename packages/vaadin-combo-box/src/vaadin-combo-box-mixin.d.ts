import { ComboBoxRenderer } from './interfaces';

declare function ComboBoxMixin<TItem, T extends new (...args: any[]) => {}>(
  base: T
): T & ComboBoxMixinConstructor<TItem>;

interface ComboBoxMixinConstructor<TItem> {
  new (...args: any[]): ComboBoxMixin<TItem>;
}

interface ComboBoxMixin<TItem> {
  readonly _propertyForValue: string;

  /**
   * True if the dropdown is open, false otherwise.
   */
  opened: boolean;

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  autoOpenDisabled: boolean | null | undefined;

  /**
   * Set to true to disable this element.
   */
  disabled: boolean;

  /**
   * When present, it specifies that the element field is read-only.
   */
  readonly: boolean;

  /**
   * Custom function for rendering the content of every item.
   * Receives three arguments:
   *
   * - `root` The `<vaadin-combo-box-item>` internal container DOM element.
   * - `comboBox` The reference to the `<vaadin-combo-box>` element.
   * - `model` The object with the properties related with the rendered
   *   item, contains:
   *   - `model.index` The index of the rendered item.
   *   - `model.item` The item.
   */
  renderer: ComboBoxRenderer<TItem> | null | undefined;

  /**
   * A full set of items to filter the visible options from.
   * The items can be of either `String` or `Object` type.
   */
  items: Array<TItem> | undefined;

  /**
   * If `true`, the user can input a value that is not present in the items list.
   * `value` property will be set to the input value in this case.
   * Also, when `value` is set programmatically, the input value will be set
   * to reflect that value.
   * @attr {boolean} allow-custom-value
   */
  allowCustomValue: boolean;

  /**
   * A subset of items, filtered based on the user input. Filtered items
   * can be assigned directly to omit the internal filtering functionality.
   * The items can be of either `String` or `Object` type.
   */
  filteredItems: Array<TItem> | undefined;

  /**
   * The `String` value for the selected item of the combo box.
   *
   * When there’s no item selected, the value is an empty string.
   *
   * Use `selectedItem` property to get the raw selected item from
   * the `items` array.
   */
  value: string;

  /**
   * When set to `true`, "loading" attribute is added to host and the overlay element.
   */
  loading: boolean;

  _focusedIndex: number;

  /**
   * Filtering string the user has typed into the input field.
   */
  filter: string;

  /**
   * The selected item from the `items` array.
   */
  selectedItem: TItem | null | undefined;

  /**
   * Path for label of the item. If `items` is an array of objects, the
   * `itemLabelPath` is used to fetch the displayed string label for each
   * item.
   *
   * The item label is also used for matching items when processing user
   * input, i.e., for filtering and selecting items.
   * @attr {string} item-label-path
   */
  itemLabelPath: string;

  /**
   * Path for the value of the item. If `items` is an array of objects, the
   * `itemValuePath:` is used to fetch the string value for the selected
   * item.
   *
   * The item value is used in the `value` property of the combo box,
   * to provide the form value.
   * @attr {string} item-value-path
   */
  itemValuePath: string;

  /**
   * Path for the id of the item. If `items` is an array of objects,
   * the `itemIdPath` is used to compare and identify the same item
   * in `selectedItem` and `filteredItems` (items given by the
   * `dataProvider` callback).
   * @attr {string} item-id-path
   */
  itemIdPath: string | null | undefined;

  /**
   * The name of this element.
   */
  name: string | null | undefined;

  /**
   * Set to true if the value is invalid.
   */
  invalid: boolean;

  _toggleElement: HTMLElement | undefined;

  _clearElement: HTMLElement | undefined;

  _inputElementValue: string | null | undefined;

  /**
   * Requests an update for the content of items.
   * While performing the update, it invokes the renderer (passed in the `renderer` property) once an item.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  /**
   * Manually invoke existing renderer.
   *
   * @deprecated Since Vaadin 21, `render()` is deprecated. Please use `requestContentUpdate()` instead.
   */
  render(): void;

  /**
   * Opens the dropdown list.
   */
  open(): void;

  /**
   * Closes the dropdown list.
   */
  close(): void;

  _onEscape(e: KeyboardEvent): void;

  /**
   * Clears the current value.
   */
  _clear(): void;

  /**
   * Reverts back to original value.
   */
  cancel(): void;

  /**
   * Filtering and items handling
   */
  _inputValueChanged(e: Event): void;

  _revertInputValue(): void;

  /**
   * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
   *
   * @returns True if the value is valid and sets the `invalid` flag appropriately
   */
  validate(): boolean;

  /**
   * Returns true if the current input value satisfies all constraints (if any)
   *
   * You can override the `checkValidity` method for custom validations.
   */
  checkValidity(): boolean | undefined;

  _preventInputBlur(): void;

  _restoreInputBlur(): void;

  _stopPropagation(e: Event): void;
}

export { ComboBoxMixin, ComboBoxMixinConstructor };
