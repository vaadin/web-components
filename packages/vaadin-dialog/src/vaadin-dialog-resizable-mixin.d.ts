import { DialogResizableDirection, DialogResizeDimensions } from './interfaces';

declare function DialogResizableMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & DialogResizableMixinConstructor;

interface DialogResizableMixinConstructor {
  new (...args: any[]): DialogResizableMixin;
}

interface DialogResizableMixin {
  /**
   * Set to true to enable resizing the dialog by dragging the corners and edges.
   */
  resizable: boolean;

  _startResize(e: MouseEvent | TouchEvent, direction: DialogResizableDirection): void;

  _resize(e: MouseEvent | TouchEvent, resizer: DialogResizableDirection): void;

  _stopResize(direction: DialogResizableDirection): void;

  _getResizeDimensions(): DialogResizeDimensions;
}

export { DialogResizableMixin, DialogResizableMixinConstructor };
