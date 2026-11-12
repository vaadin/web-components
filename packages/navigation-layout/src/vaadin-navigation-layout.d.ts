/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-navigation-layout>` is a layout for navigation content, with optional
 * fixed areas at the start and end, and a scrollable area in between.
 *
 * ```html
 * <vaadin-navigation-layout>
 *   <vaadin-navigation-layout-toggle slot="start">Toggle</vaadin-navigation-layout-toggle>
 *   <vaadin-side-nav>...</vaadin-side-nav>
 *   <div slot="end">Footer</div>
 * </vaadin-navigation-layout>
 * ```
 *
 * When the `collapsed` attribute is set, the layout sets the
 * `--vaadin-navigation-layout-collapsed` custom property to `1` (otherwise `0`),
 * which descendants can use in container style queries:
 *
 * ```css
 * @container style(--vaadin-navigation-layout-collapsed: 1) {
 *   .label {
 *     display: none;
 *   }
 * }
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|------------
 * `start`   | The container wrapping the `start` slot
 * `content` | The scroller wrapping the default slot
 * `end`     | The container wrapping the `end` slot
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|------------
 * `collapsed` | Set when the layout is collapsed
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                     |
 * :---------------------------------------|
 * `--vaadin-navigation-layout-collapsed`  |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class NavigationLayout extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * When true, the layout is collapsed.
   */
  collapsed: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-navigation-layout': NavigationLayout;
  }
}

export { NavigationLayout };
