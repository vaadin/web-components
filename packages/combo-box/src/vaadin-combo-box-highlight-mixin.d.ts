/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin that tracks which element of a combo box has the keyboard highlight
 * while the DOM focus stays in the input. Only one element is highlighted at
 * a time.
 */
export declare function ComboBoxHighlightMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxHighlightMixinClass> & T;

// Nothing to declare, all state and methods are considered internal
export declare class ComboBoxHighlightMixinClass {}
