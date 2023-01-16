/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';

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

/**
 * An element used internally by `<vaadin-dialog>`. Not intended to be used separately.
 */
export class DialogOverlay extends Overlay {
  /**
   * Retrieves the coordinates of the overlay.
   */
  getBounds(): DialogOverlayBounds;

  /**
   * Updates the coordinates of the overlay.
   */
  setBounds(bounds: DialogOverlayBoundsParam): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dialog-overlay': DialogOverlay;
  }
}
