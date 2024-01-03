/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ComboBoxDefaultItem, ComboBoxItemMixinClass } from '@vaadin/combo-box/src/vaadin-combo-box-item-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { MultiSelectComboBox } from './vaadin-multi-select-combo-box.js';

/**
 * An item element used by the `<vaadin-multi-select-combo-box>` dropdown.
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
declare class MultiSelectComboBoxItem extends HTMLElement {}

interface MultiSelectComboBoxItem<TItem = ComboBoxDefaultItem>
  extends ComboBoxItemMixinClass<TItem, MultiSelectComboBox>,
    DirMixinClass,
    ThemableMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-multi-select-combo-box-item': MultiSelectComboBoxItem;
  }
}

export { MultiSelectComboBoxItem };
