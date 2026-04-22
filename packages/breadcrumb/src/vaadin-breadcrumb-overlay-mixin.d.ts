/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * `BreadcrumbOverlayMixin` carries any breadcrumb-specific overlay tweaks on
 * top of `OverlayMixin`, mirroring the `ComboBoxOverlayMixin` /
 * `MenuOverlayMixin` pattern used by other Vaadin overlays. The mixin is a
 * dedicated extension point — currently empty because the breadcrumb overflow
 * overlay needs nothing beyond what `OverlayMixin` already provides.
 */
export declare function BreadcrumbOverlayMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<BreadcrumbOverlayMixinClass> & T;

export declare class BreadcrumbOverlayMixinClass {}
