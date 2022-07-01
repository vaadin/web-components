/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function DialogResizableMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DialogResizableMixinClass> & T;

export declare class DialogResizableMixinClass {
  /**
   * Set to true to enable resizing the dialog by dragging the corners and edges.
   */
  resizable: boolean;
}
