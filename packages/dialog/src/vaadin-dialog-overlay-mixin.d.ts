/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DialogRenderer } from './vaadin-dialog.js';

export declare function DialogOverlayMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DialogOverlayMixinClass> & T;

export declare class DialogOverlayMixinClass {
  /**
   * String used for rendering a dialog title.
   * @attr {string} header-title
   */
  headerTitle: string;

  /**
   * Custom function for rendering the dialog header.
   */
  headerRenderer: DialogRenderer | null | undefined;

  /**
   * Custom function for rendering the dialog footer.
   */
  footerRenderer: DialogRenderer | null | undefined;
}
