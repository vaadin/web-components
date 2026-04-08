/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export interface BreadcrumbItemData {
  text: string;
  path?: string;
  disabled?: boolean;
}

/**
 * A mixin providing common breadcrumb functionality.
 */
export declare function BreadcrumbMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<BreadcrumbMixinClass> & Constructor<ResizeMixinClass> & T;

export declare class BreadcrumbMixinClass {
  /**
   * Accessible label for the breadcrumb navigation landmark.
   * Applied as `aria-label` on the host element.
   */
  label: string | undefined;

  /**
   * Data-driven items as an alternative to slotted children.
   * Each item is an object with `text` (required), `path` (optional),
   * and `disabled` (optional) properties.
   */
  items: BreadcrumbItemData[] | undefined;
}
