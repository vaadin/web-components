/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';

export declare function SliderMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DisabledMixinClass> & Constructor<SliderMixinClass> & T;

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
   * The stepping interval of the slider.
   */
  step: number;
}
