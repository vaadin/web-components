/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ConfirmDialogBaseMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ConfirmDialogBaseMixinClass> & T;

export declare class ConfirmDialogBaseMixinClass {
  /**
   * Set the `aria-label` attribute for assistive technologies like
   * screen readers. An empty string value for this property (the
   * default) means that the `aria-label` attribute is not present.
   */
  ariaLabel: string;

  /**
   * Height to be set on the overlay content.
   */
  contentHeight: string;

  /**
   * Width to be set on the overlay content.
   */
  contentWidth: string;
}
