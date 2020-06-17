import { DialogElement } from '../src/vaadin-dialog.js';

export type DialogRenderer = (root: HTMLElement, dialog?: DialogElement) => void;

export type DialogResizableDirection = 'n' | 'e' | 's' | 'w' | 'nw' | 'ne' | 'se' | 'sw';

export type DialogResizeDimensions = {
  width: string;
  height: string;
  contentWidth: string;
  contentHeight: string;
};

export type DialogOverlayBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type DialogOverlayBoundsParam = DialogOverlayBounds | {
  top?: string | number;
  left?: string | number;
  width?: string | number;
  height?: string | number;
};
