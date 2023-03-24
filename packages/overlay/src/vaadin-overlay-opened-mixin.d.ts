/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function OpenedMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<OpenedMixinClass> & T;

export declare class OpenedMixinClass {
  /**
   * When true, the overlay is visible and attached to body.
   */
  opened: boolean;

  /**
   * Closes the overlay.
   */
  close(): void;

  protected _close(sourceEvent?: Event): void;
}
