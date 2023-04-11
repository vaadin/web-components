/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
): T &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<TabindexMixinClass>;
