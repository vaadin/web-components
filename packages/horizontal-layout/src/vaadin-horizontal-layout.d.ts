/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { HorizontalLayoutMixin } from './vaadin-horizontal-layout-mixin.js';

/**
 * `<vaadin-horizontal-layout>` provides a simple way to horizontally align your HTML elements.
 *
 * ```html
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
 * Theme variation    | Description
 * -------------------|---------------
 * `theme="margin"`   | Applies the default amount of CSS margin for the host element
 * `theme="padding"`  | Applies the default amount of CSS padding for the host element
 * `theme="spacing"`  | Applies the default amount of CSS margin between items
 * `theme="wrap"`     | Items wrap to the next row when they exceed the layout width
 *
 * ### Component's slots
 *
 * The following slots are available to be set:
 *
 * Slot name          | Description
 * -------------------|---------------
 * no name            | Default slot
 * `middle`           | Slot for the content placed in the middle
 * `end`              | Slot for the content placed at the end
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                  | Description
 * -------------------------------------|-------------
 * `--vaadin-horizontal-layout-margin`  | The default CSS margin applied when using `theme="margin"`
 * `--vaadin-horizontal-layout-padding` | The default CSS padding applied when using `theme="padding"`
 * `--vaadin-horizontal-layout-gap`     | The default CSS gap applied when using `theme="spacing"`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class HorizontalLayout extends HorizontalLayoutMixin(ThemableMixin(ElementMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-horizontal-layout': HorizontalLayout;
  }
}

export { HorizontalLayout };
