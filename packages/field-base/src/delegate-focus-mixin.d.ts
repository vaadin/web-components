/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from './focus-mixin.js';
import { DisabledMixin } from './disabled-mixin.js';

/**
 * A mixin to forward focus to an element in the light DOM.
 */
declare function DelegateFocusMixin<T extends new (...args: any[]) => {}>(base: T): T & DelegateFocusMixinConstructor;

interface DelegateFocusMixinConstructor {
  new (...args: any[]): DelegateFocusMixin;
}

interface DelegateFocusMixin extends DisabledMixin, FocusMixin {
  /**
   * Specify that this control should have input focus when the page loads.
   */
  autofocus: boolean;

  /**
   * Any element extending this mixin is required to implement this getter.
   * It returns the actual focusable element in the component.
   */
  readonly focusElement: Element | null | undefined;
}

export { DelegateFocusMixinConstructor, DelegateFocusMixin };
