/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ActiveMixinClass } from '@vaadin/component-base/src/active-mixin.js';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { TabindexMixinClass } from '@vaadin/component-base/src/tabindex-mixin.js';

/**
 * A mixin providing common button functionality.
 */
export declare function ButtonMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ActiveMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<TabindexMixinClass> &
  T;
