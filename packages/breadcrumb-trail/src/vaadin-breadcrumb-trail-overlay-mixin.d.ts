/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing component-specific behavior for `<vaadin-breadcrumb-trail-overlay>`.
 *
 * Task 1 ships this as an identity mixin; Task 10 fills it in.
 */
export declare function BreadcrumbTrailOverlayMixin<T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<BreadcrumbTrailOverlayMixinClass>;

export declare class BreadcrumbTrailOverlayMixinClass {}
