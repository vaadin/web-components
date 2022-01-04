/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin that uses a ResizeObserver to listen to host size changes.
 */
export declare function ResizeMixin<T extends Constructor<HTMLElement>>(base: T): T & Constructor<ResizeMixinClass>;

export declare class ResizeMixinClass {
  /**
   * A handler invoked on host resize. By default, it does nothing.
   * Override the method to implement your own behavior.
   */
  protected _onResize(contentRect: DOMRect): void;
}
