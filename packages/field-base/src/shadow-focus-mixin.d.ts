/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { TabindexMixinClass } from '@vaadin/component-base/src/tabindex-mixin.js';
import { DelegateFocusMixinClass } from './delegate-focus-mixin.js';

/**
 * A mixin to forward focus to an element in the shadow DOM.
 */
export declare function ShadowFocusMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DelegateFocusMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<TabindexMixinClass> &
  T;
