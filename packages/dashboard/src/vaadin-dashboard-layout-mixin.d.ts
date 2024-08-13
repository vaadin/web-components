/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin to enable the dashboard layout functionality.
 */
export declare function DashboardLayoutMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DashboardLayoutMixinClass> & T;

export declare class DashboardLayoutMixinClass {}
