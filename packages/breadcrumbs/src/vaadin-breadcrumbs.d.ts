/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export interface BreadcrumbsI18n {
  moreItems?: string;
}

/**
 * `<vaadin-breadcrumbs>` is a Web Component that displays the user's location
 * within a hierarchy as a trail of links from the root to the current page.
 *
 * ```html
 * <vaadin-breadcrumbs>
 *   <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
 *   <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
 *   <vaadin-breadcrumbs-item>Current page</vaadin-breadcrumbs-item>
 * </vaadin-breadcrumbs>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name          | Description
 * -------------------|------------
 * `list`             | The element with `role="list"` wrapping all items.
 * `overflow`         | The element wrapping the overflow button.
 * `overflow-button`  | The button that reveals collapsed items.
 * `overlay`          | The outer panel of the overflow overlay.
 * `overlay-content`  | The inner wrapper of the overflow overlay.
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|------------
 * `has-overflow` | Set when one or more items are collapsed into the overflow overlay.
 *
 * The following custom CSS properties are available for styling:
 *
 * - `--vaadin-breadcrumbs-separator`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Breadcrumbs extends ElementMixin(HTMLElement) {}

interface Breadcrumbs extends I18nMixinClass<BreadcrumbsI18n>, KeyboardDirectionMixinClass, ResizeMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumbs': Breadcrumbs;
  }
}

export { Breadcrumbs };
