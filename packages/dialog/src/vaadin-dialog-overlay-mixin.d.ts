/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { OverlayMixinClass } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import type { DialogRenderer } from './vaadin-dialog.js';

export type DialogOverlayBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type DialogOverlayBoundsParam =
  | DialogOverlayBounds
  | {
      top?: number | string;
      left?: number | string;
      width?: number | string;
      height?: number | string;
    };

export declare function DialogOverlayMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DialogOverlayMixinClass> & Constructor<OverlayMixinClass> & T;

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

  /**
   * Retrieves the coordinates of the overlay.
   */
  getBounds(): DialogOverlayBounds;

  /**
   * Updates the coordinates of the overlay.
   */
  setBounds(bounds: DialogOverlayBoundsParam, absolute: boolean): void;
}
