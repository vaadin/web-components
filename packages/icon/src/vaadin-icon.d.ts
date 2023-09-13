/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { IconFontSizeMixin } from './vaadin-icon-font-size-mixin.js';
import type { IconSvgLiteral } from './vaadin-icon-svg.js';

/**
 * `<vaadin-icon>` is a Web Component for displaying SVG icons.
 *
 * ### Icon property
 *
 * The `<vaadin-icon>` component is designed to be used as a drop-in replacement for `<iron-icon>`.
 * For example, you can use it with `vaadin-icons` like this:
 *
 * ```html
 * <vaadin-icon icon="vaadin:angle-down"></vaadin-icon>
 * ```
 *
 * Alternatively, you can also pick one of the Lumo icons:
 *
 * ```html
 * <vaadin-icon icon="lumo:user"></vaadin-icon>
 * ```
 *
 * ### Custom SVG icon
 *
 * Alternatively, instead of selecting an icon from an iconset by name, you can pass any custom `svg`
 * literal using the [`svg`](#/elements/vaadin-icon#property-svg) property. In this case you can also
 * define the size of the SVG `viewBox` using the [`size`](#/elements/vaadin-icon#property-size) property:
 *
 * ```js
 * import { html, svg } from 'lit';
 *
 * // in your component
 * render() {
 *   const svgIcon = svg`<path d="M13 4v2l-5 5-5-5v-2l5 5z"></path>`;
 *   return html`
 *     <vaadin-icon
 *       .svg="${svgIcon}"
 *       size="16"
 *     ></vaadin-icon>
 *   `;
 * }
 * ```
 */
declare class Icon extends ThemableMixin(
  ElementMixin(ControllerMixin(SlotStylesMixin(IconFontSizeMixin(HTMLElement)))),
) {
  /**
   * The name of the icon to use. The name should be of the form:
   * `iconset_name:icon_name`. When using `vaadin-icons` it is possible
   * to omit the first part and only use `icon_name` as a value.
   *
   * Setting the `icon` property updates the `svg` and `size` based on the
   * values provided by the corresponding `vaadin-iconset` element.
   *
   * See also [`name`](#/elements/vaadin-iconset#property-name) property of `vaadin-iconset`.
   *
   * @attr {string} icon
   */
  icon: string | null;

  /**
   * The SVG icon wrapped in a Lit template literal.
   */
  svg: IconSvgLiteral | null;

  /**
   * The SVG source to be loaded as the icon. It can be:
   * - an URL to a file containing the icon
   * - an URL in the format "/path/to/file.svg#objectID", where the "objectID" refers to an ID attribute contained
   *   inside the SVG referenced by the path. Note that the file needs to follow the same-origin policy.
   * - a string in the format "data:image/svg+xml,<svg>...</svg>". You may need to use the "encodeURIComponent"
   *   function for the SVG content passed
   */
  src: string | null;

  /**
   * The symbol identifier that references an ID of an element contained in the SVG element assigned to the
   * `src` property
   */
  symbol: string | null;

  /**
   * Class names defining an icon font and/or a specific glyph inside an icon font.
   *
   * Example: "fa-solid fa-user"
   *
   * @attr {string} icon-class
   */
  iconClass: string | null;

  /**
   * A hexadecimal code point that specifies a glyph from an icon font.
   *
   * Example: "e001"
   */
  char: string | null;

  /**
   * A ligature name that specifies an icon from an icon font with support for ligatures.
   *
   * Example: "home".
   */
  ligature: string | null;

  /**
   * The font family to use for the font icon.
   */
  fontFamily: string | null;

  /**
   * The size of an icon, used to set the `viewBox` attribute.
   */
  size: number;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-icon': Icon;
  }
}

export { Icon };
