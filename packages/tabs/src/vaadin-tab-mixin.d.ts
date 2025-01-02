/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ActiveMixinClass } from '@vaadin/a11y-base/src/active-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ItemMixinClass } from '@vaadin/item/src/vaadin-item-mixin.js';

export declare function TabMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ActiveMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<ItemMixinClass> &
  T;
