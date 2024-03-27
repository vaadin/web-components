/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-horizontal-layout>` provides a simple way to horizontally align your HTML elements.
 *
 * ```
 * <vaadin-horizontal-layout>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </vaadin-horizontal-layout>
 * ```
 *
 * ### Built-in Theme Variations
 *
 * `<vaadin-horizontal-layout>` supports the following theme variations:
 *
 * Theme variation | Description
 * ---|---
 * `theme="margin"` | Applies the default amount of CSS margin for the host element (specified by the theme)
 * `theme="padding"` | Applies the default amount of CSS padding for the host element (specified by the theme)
 * `theme="spacing"` | Applies the default amount of CSS margin between items (specified by the theme)
 */
declare class HorizontalLayout extends ThemableMixin(ElementMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-horizontal-layout': HorizontalLayout;
  }
}

export { HorizontalLayout };
