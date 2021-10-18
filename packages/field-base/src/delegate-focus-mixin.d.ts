/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixinInterface } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusMixinInterface } from '@vaadin/component-base/src/focus-mixin.js';

/**
 * A mixin to forward focus to an element in the light DOM.
 */
declare const DelegateFocusMixin: <T>(superClass: T) => Constructor<DelegateFocusMixinInterface> & T;

declare type Constructor<T> = new (...args: any[]) => T;

declare class DelegateFocusMixinClass {
  /**
   * Specify that this control should have input focus when the page loads.
   */
  autofocus: boolean;

  /**
   * A reference to the focusable element controlled by the mixin.
   * It can be an input, textarea, button or any element with tabindex > -1.
   *
   * Any component implementing this mixin is expected to provide it
   * by using `this._setFocusElement(input)` Polymer API.
   */
  readonly focusElement: Element | null | undefined;
}

type DelegateFocusMixinInterface = DisabledMixinInterface & FocusMixinInterface & DelegateFocusMixinClass;

export { DelegateFocusMixin, DelegateFocusMixinInterface };
