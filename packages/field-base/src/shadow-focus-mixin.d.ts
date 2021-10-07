/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { TabindexMixin } from '@vaadin/component-base/src/tabindex-mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';

/**
 * A mixin to forward focus to an element in the shadow DOM.
 */
declare function ShadowFocusMixin<T extends new (...args: any[]) => {}>(base: T): T & ShadowFocusMixinConstructor;

interface ShadowFocusMixinConstructor {
  new (...args: any[]): ShadowFocusMixin;
}

interface ShadowFocusMixin extends KeyboardMixin, TabindexMixin, DelegateFocusMixin {}

export { ShadowFocusMixinConstructor, ShadowFocusMixin };
