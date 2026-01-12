/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function SliderMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<SliderMixinClass> & T;

export declare class SliderMixinClass {
  /**
   * The minimum allowed value.
   */
  min: number;

  /**
   * The maximum allowed value.
   */
  max: number;

  /**
   * The value of the slider.
   */
  value: string | null | undefined;
}
