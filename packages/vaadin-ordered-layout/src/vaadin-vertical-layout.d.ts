import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * `<vaadin-vertical-layout>` provides a simple way to vertically align your HTML elements.
 *
 * ```
 * <vaadin-vertical-layout>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </vaadin-vertical-layout>
 * ```
 *
 * ### Built-in Theme Variations
 *
 * `<vaadin-vertical-layout>` supports the following theme variations:
 *
 * Theme variation | Description
 * ---|---
 * `theme="margin"` | Applies the default amount of CSS margin for the host element (specified by the theme)
 * `theme="padding"` | Applies the default amount of CSS padding for the host element (specified by the theme)
 * `theme="spacing"` | Applies the default amount of CSS margin between items (specified by the theme)
 */
declare class VerticalLayoutElement extends ThemableMixin(ElementMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-vertical-layout': VerticalLayoutElement;
  }
}

export { VerticalLayoutElement };
