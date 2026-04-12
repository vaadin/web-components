/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a breadcrumb item element to be used within
 * `<vaadin-breadcrumb>`.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|-------------
 * `separator` | The separator region rendered before the item's link. Hidden on the first item.
 * `link`      | The `<a>` element. Non-interactive when `current`, `disabled`, or `path` is unset.
 *
 * The following state attributes are available for styling:
 *
 * Attribute     | Description
 * --------------|-------------
 * `disabled`    | Set when the element is disabled.
 * `current`     | Set when the element represents the current page.
 * `has-tooltip` | Set when the element has a slotted tooltip.
 *
 * The following custom CSS properties are available:
 *
 * Custom CSS property                    | Description                                         | Default
 * :--------------------------------------|:----------------------------------------------------|:-------
 * `--vaadin-breadcrumb-item-max-width`   | Maximum width before text truncation with ellipsis. | `12em`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class BreadcrumbItem extends DisabledMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  /**
   * The navigation target path. Maps to `href` on the internal `<a>` element.
   * When `undefined`, the item is treated as non-interactive text.
   */
  path: string | null | undefined;

  /**
   * Whether this item represents the current page. Set by the container
   * via `_setCurrent()`. When `true`, the link is non-interactive and
   * receives `aria-current="page"`.
   */
  readonly current: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
