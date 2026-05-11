/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-breadcrumbs>` is a Web Component that displays the user's location
 * within a hierarchy as a trail of links from the root to the current page.
 *
 * ```html
 * <vaadin-breadcrumbs aria-label="Navigation">
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
 * Part name | Description
 * ----------|------------
 * `list`    | The element with `role="list"` wrapping all items.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property              | Description
 * ---------------------------------|-------------
 * `--vaadin-breadcrumbs-separator` | The mask-image icon used as the separator between items. Cascades to every `<vaadin-breadcrumbs-item>` child.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Breadcrumbs extends ElementMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumbs': Breadcrumbs;
  }
}

export { Breadcrumbs };
