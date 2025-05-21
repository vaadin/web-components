/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * A mixin to enable the dashboard layout functionality.
 */
export declare function DashboardLayoutMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DashboardLayoutMixinClass> & Constructor<ResizeMixinClass> & T;

export declare class DashboardLayoutMixinClass {
  /**
   * Whether the dashboard layout is dense.
   *
   * @attr {boolean} dense-layout
   */
  denseLayout: boolean;

  /**
   * Root heading level for sections and widgets. Defaults to 2.
   *
   * If changed to e.g. 1:
   * - sections will have the attribute `aria-level` with value 1
   * - non-nested widgets will have the attribute `aria-level` with value 1
   * - nested widgets will have the attribute `aria-level` with value 2
   */
  rootHeadingLevel: number | null | undefined;
}
