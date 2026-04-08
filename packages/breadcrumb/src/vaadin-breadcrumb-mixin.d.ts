/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ActiveMixinClass } from '@vaadin/a11y-base/src/active-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { TabindexMixinClass } from '@vaadin/a11y-base/src/tabindex-mixin.js';

/**
 * A mixin providing common breadcrumb functionality.
 */
export declare function BreadcrumbMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ActiveMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<TabindexMixinClass> &
  Constructor<BreadcrumbMixinClass> &
  T;

export declare class BreadcrumbMixinClass {}
