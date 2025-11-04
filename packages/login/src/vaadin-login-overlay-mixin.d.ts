/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function LoginOverlayMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<LoginOverlayMixinClass> & T;

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
