/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-select-item>` is a Web Component for creating `<vaadin-select>` items.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|----------------
 * `checkmark`  | The graphical checkmark shown for a selected item
 * `content`    | The element that wraps the slot
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `active`     | Set when the item is pressed down, either with mouse, touch or the keyboard.
 * `disabled`   | Set when the item is disabled.
 * `focus-ring` | Set when the item is focused using the keyboard.
 * `focused`    | Set when the item is focused.
 * `selected`   | Set when the item is selected
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                |
 * :----------------------------------|
 * | `--vaadin-item-border-radius`    |
 * | `--vaadin-item-checkmark-color`  |
 * | `--vaadin-item-gap`              |
 * | `--vaadin-item-height`           |
 * | `--vaadin-item-padding`          |
 * | `--vaadin-item-text-align`       |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class SelectItem extends ItemMixin(DirMixin(ThemableMixin(HTMLElement))) {
  /**
   * Submittable string value. The default value is the trimmed text content of the element.
   */
  value: string;

  /**
   * String that can be set to visually represent the selected item in `vaadin-select`.
   */
  label: string | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-select-item': SelectItem;
  }
}

export { SelectItem };
