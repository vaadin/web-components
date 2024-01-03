/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { LoginMixinClass } from './vaadin-login-mixin.js';

export declare function LoginFormMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<LoginFormMixinClass> & Constructor<LoginMixinClass> & T;

export declare class LoginFormMixinClass {
  /**
   * Submits the form.
   */
  submit(): void;
}
