/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function DialogSizeMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DialogSizeMixinClass> & T;

export declare class DialogSizeMixinClass {
  /**
   * Set the width of the dialog.
   * If a unitless number is provided, pixels are assumed.
   */
  width: string | null;

  /**
   * Set the height of the dialog.
   * If a unitless number is provided, pixels are assumed.
   */
  height: string | null;
}
