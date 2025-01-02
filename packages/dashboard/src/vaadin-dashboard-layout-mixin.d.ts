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
}
