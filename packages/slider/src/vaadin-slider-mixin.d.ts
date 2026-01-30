/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';

export declare function SliderMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DisabledMixinClass> & Constructor<SliderMixinClass> & Constructor<SlotStylesMixinClass> & T;

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

  /**
   * When true, the user cannot modify the value of the slider.
   * The difference between `disabled` and `readonly` is that the
   * read-only slider remains focusable and is announced by screen
   * readers.
   */
  readonly: boolean;
}
