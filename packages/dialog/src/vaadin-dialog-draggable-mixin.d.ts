/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function DialogDraggableMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DialogDraggableMixinClass> & T;

export declare class DialogDraggableMixinClass {
  /**
   * Set to true to enable repositioning the dialog by clicking and dragging.
   *
   * By default, only the overlay area can be used to drag the element. But,
   * a child element can be marked as a draggable area by adding a
   * "`draggable`" class to it, this will by default make all of its children draggable also.
   * If you want a child element to be draggable
   * but still have its children non-draggable (by default), mark it with
   * "`draggable-leaf-only`" class name.
   */
  draggable: boolean;
}
