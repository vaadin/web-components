/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-breadcrumbs-item>` is a single item inside a `<vaadin-breadcrumbs>`.
 *
 * ```html
 * <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|------------------------------------------------------------
 * `link`    | The interactive `<a>` rendered when `path` is set.
 * `nolink`  | The non-interactive `<span>` rendered when `path` is unset.
 * `label`   | Wraps the item's text content, inside `link` or `nolink`.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `current`    | Set by the parent `<vaadin-breadcrumbs>` on the last item when it has no `path`.
 * `disabled`   | Set when the item is disabled.
 * `focus-ring` | Set when the item is focused by the keyboard.
 * `focused`    | Set when the item is focused.
 * `has-prefix` | Set when the item has content in the prefix slot
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class BreadcrumbsItem extends FocusMixin(DisabledMixin(ElementMixin(HTMLElement))) {
  /**
   * The path to navigate to. When set, the item renders as a link
   * (`<a part="link">`); when unset, it renders as a non-link
   * (`<span part="nolink">`).
   */
  path: string | null | undefined;

  /**
   * When true, the item represents the current page. Set by the parent
   * `<vaadin-breadcrumbs>` on the last item when it has no `path`. The
   * item reflects this state by applying `aria-current="page"` to its
   * inner `[part="nolink"]` element.
   */
  readonly current: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumbs-item': BreadcrumbsItem;
  }
}

export { BreadcrumbsItem };
