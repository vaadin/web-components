/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ModalityMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ModalityMixinClass> & T;

export declare class ModalityMixinClass {
  /**
   * When true, opening the overlay moves focus to the first focusable child,
   * or to the overlay part with tabindex if there are no focusable children.
   * @attr {boolean} focus-trap
   */
  focusTrap: boolean;
}
