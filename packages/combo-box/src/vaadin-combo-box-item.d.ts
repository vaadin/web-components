/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ComboBox } from './vaadin-combo-box.js';
import type { ComboBoxDefaultItem, ComboBoxItemMixinClass } from './vaadin-combo-box-item-mixin.js';

/**
 * An item element used by the `<vaadin-combo-box>` dropdown.
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
declare class ComboBoxItem extends HTMLElement {}

interface ComboBoxItem<TItem = ComboBoxDefaultItem>
  extends ComboBoxItemMixinClass<TItem, ComboBox>,
    DirMixinClass,
    ThemableMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-combo-box-item': ComboBoxItem;
  }
}

export { ComboBoxItem };
