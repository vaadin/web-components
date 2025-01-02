/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { PositionMixinClass } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

export declare function ComboBoxOverlayMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PositionMixinClass> & T;
