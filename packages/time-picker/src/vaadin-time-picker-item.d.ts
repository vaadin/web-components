/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ComboBoxItemMixinClass } from '@vaadin/combo-box/src/vaadin-combo-box-item-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { TimePicker } from './vaadin-time-picker.js';

/**
 * An item element used by the `<vaadin-time-picker>` dropdown.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|--------------
 * `checkmark` | The graphical checkmark shown for a selected item
 * `content`   | The element that wraps the item content
 *
 * The following state attributes are exposed for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `selected`   | Set when the item is selected
 * `focused`    | Set when the item is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class TimePickerItem extends HTMLElement {}

interface TimePickerItem extends ComboBoxItemMixinClass<string, TimePicker>, DirMixinClass, ThemableMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-time-picker-item': TimePickerItem;
  }
}

export { TimePickerItem };
