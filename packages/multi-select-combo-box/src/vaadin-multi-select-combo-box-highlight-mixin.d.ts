/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ComboBoxHighlightMixinClass } from '@vaadin/combo-box/src/vaadin-combo-box-highlight-mixin.js';

/**
 * A mixin that extends `ComboBoxHighlightMixin` with a highlight state for the
 * chips of the selected items, so that chips can be navigated with arrow keys
 * while the DOM focus stays in the input.
 */
export declare function MultiSelectComboBoxHighlightMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxHighlightMixinClass> & Constructor<MultiSelectComboBoxHighlightMixinClass> & T;

// Nothing to declare, all state and methods are considered internal
export declare class MultiSelectComboBoxHighlightMixinClass {}
