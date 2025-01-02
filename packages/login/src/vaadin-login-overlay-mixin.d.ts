/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { LoginMixinClass } from './vaadin-login-mixin.js';

export declare function LoginOverlayMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<LoginMixinClass> & Constructor<LoginOverlayMixinClass> & Constructor<OverlayClassMixinClass> & T;

export declare class LoginOverlayMixinClass {
  /**
   * Defines the application description
   */
  description: string;

  /**
   * True if the overlay is currently displayed.
   */
  opened: boolean;

  /**
   * Defines the application title
   */
  title: string;
}
