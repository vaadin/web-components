/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function DialogResizableMixin<T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<DialogResizableMixinClass>;

export declare class DialogResizableMixinClass {
  /**
   * Set to true to enable resizing the dialog by dragging the corners and edges.
   */
  resizable: boolean;
}
