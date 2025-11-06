/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ScrollerMixin } from './vaadin-scroller-mixin.js';

/**
 * `<vaadin-scroller>` provides a simple way to enable scrolling when its content is overflowing.
 *
 * ```html
 * <vaadin-scroller>
 *   <div>Content</div>
 * </vaadin-scroller>
 * ```
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 * `overflow`   | Set to `top`, `bottom`, `start`, `end`, all of them, or none.
 *
 * ### Built-in Theme Variants
 *
 * `<vaadin-scroller>` supports the following theme variants:
 *
 * Theme variant                            | Description
 * -----------------------------------------|---------------
 * `theme="overflow-indicators"`            | Shows visual indicators at the top and bottom when the content is scrolled
 * `theme="overflow-indicator-top"`         | Shows the visual indicator at the top when the content is scrolled
 * `theme="overflow-indicator-top-bottom"`  | Shows the visual indicator at the bottom when the content is scrolled
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                | Description
 * -----------------------------------|-------------
 * `--vaadin-scroller-padding-block`  | The CSS padding applied to top and bottom edges
 * `--vaadin-scroller-padding-inline` | The CSS padding applied to left and right edges
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Scroller extends ScrollerMixin(ThemableMixin(ElementMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-scroller': Scroller;
  }
}

export { Scroller };
