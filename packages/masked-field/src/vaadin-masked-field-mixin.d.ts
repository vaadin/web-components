/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { FormatMixinClass } from './format-mixin.js';
import type { InputFormatMixinClass } from './input-format-mixin.js';

export declare function MaskedFieldMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<FormatMixinClass> & Constructor<InputFormatMixinClass> & Constructor<MaskedFieldMixinClass> & T;

export declare class MaskedFieldMixinClass {
  /**
   * Returns true if the current value satisfies all constraints, if any.
   */
  checkValidity(): boolean;
}
