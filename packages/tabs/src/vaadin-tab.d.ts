/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-tab>` is a Web Component providing an accessible and customizable tab.
 *
 * ```html
 * <vaadin-tab>Tab 1</vaadin-tab>
 * ```
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|---------------------------------
 * `disabled`     | Set when the element is disabled
 * `focused`      | Set when the element is focused
 * `focus-ring`   | Set when the element is keyboard focused
 * `selected`     | Set when the tab is selected
 * `active`       | Set when mousedown or enter/spacebar pressed
 * `orientation`  | Set to `horizontal` or `vertical` depending on the direction of items
 * `has-tooltip`  | Set when the tab has a slotted tooltip
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property            |
 * :------------------------------|
 * | `--vaadin-tab-background`    |
 * | `--vaadin-tab-border-color`  |
 * | `--vaadin-tab-border-width`  |
 * | `--vaadin-tab-font-size`     |
 * | `--vaadin-tab-font-weight`   |
 * | `--vaadin-tab-gap`           |
 * | `--vaadin-tab-padding`       |
 * | `--vaadin-tab-text-color`    |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Tab extends ElementMixin(ThemableMixin(ItemMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tab': Tab;
  }
}

export { Tab };
