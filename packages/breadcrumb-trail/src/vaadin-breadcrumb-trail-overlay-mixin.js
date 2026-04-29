/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin providing component-specific behavior for `<vaadin-breadcrumb-trail-overlay>`.
 *
 * Task 1 (package scaffolding) ships this as an identity mixin. Task 10 fills in
 * the actual behavior — `_rendererRoot` redirection so the renderer writes into
 * the breadcrumb's light-DOM overlay slot rather than the overlay's `[part="content"]`,
 * theme-attribute propagation, and any close-behavior tweaks specific to the
 * overflow popup. The placeholder exists so the element's mixin chain is correct
 * from day one.
 *
 * TODO(task-10): Fill in `_rendererRoot` redirection and any overlay-behavior
 * specifics required by the breadcrumb overflow overlay.
 *
 * @polymerMixin
 */
export const BreadcrumbTrailOverlayMixin = (superClass) => class extends superClass {};
