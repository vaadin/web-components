/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-view-layout>` is a web component that provides a structured layout for a view,
 * with a header (prefix, title, suffix), scrollable content, and a footer.
 *
 * ```html
 * <vaadin-view-layout header-title="Bookings">
 *   <vaadin-grid></vaadin-grid>
 * </vaadin-view-layout>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `header`  | The container for the header prefix, title, header, and header suffix slots.
 * `content` | The scrollable container for the default (content) slot.
 * `footer`  | The container for the footer slot.
 */
declare class ViewLayout extends ElementMixin(HTMLElement) {
  /**
   * The title of the view. When set, an internal title element is rendered
   * in the light DOM using `<div role="heading" aria-level="N">`. A consumer
   * supplied `[slot="title"]` element takes precedence over this property.
   *
   * @attr {string} header-title
   */
  headerTitle: string;

  /**
   * Sets the heading level (`aria-level`) for the string-based title. Defaults to 2.
   * Setting values outside the range [1, 6] can cause accessibility issues.
   *
   * @attr {number} title-heading-level
   */
  titleHeadingLevel: number;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-view-layout': ViewLayout;
  }
}

export { ViewLayout };
