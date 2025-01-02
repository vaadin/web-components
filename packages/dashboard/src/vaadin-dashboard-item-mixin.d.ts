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

/**
 * Shared functionality between widgets and sections
 */
export declare function DashboardItemMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DashboardItemMixinClass> & T;

export declare class DashboardItemMixinClass {}
