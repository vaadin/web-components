/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export declare function BoardRowMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<BoardRowMixinClass> & Constructor<ResizeMixinClass> & T;

export declare class BoardRowMixinClass {
  /**
   * Redraws the row, if necessary.
   *
   * In most cases, a board row will redraw itself if your reconfigure it.
   * If you dynamically change breakpoints
   * `--vaadin-board-width-small` or `--vaadin-board-width-medium`,
   * then you need to call this method.
   */
  redraw(): void;
}
