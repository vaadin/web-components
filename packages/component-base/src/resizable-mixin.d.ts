/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin that uses a ResizeObserver to listen to host size changes.
 */
export declare function ResizableMixin<T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<ResizableMixinClass>;

export declare class ResizableMixinClass {
  /**
   * A handler invoked on host resize. By default, it does nothing.
   * Override the method to implement your own behavior.
   */
  protected _onResize(contentRect: DOMRect): void;
}
