/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import { GridSelectionColumnBaseMixinClass } from './vaadin-grid-selection-column-base-mixin.js';

/**
 * Fired when the `selectAll` property changes.
 */
export type GridSelectionColumnSelectAllChangedEvent = CustomEvent<{ value: boolean }>;

export interface GridSelectionColumnCustomEventMap {
  'select-all-changed': GridSelectionColumnSelectAllChangedEvent;
}

export interface GridSelectionColumnEventMap extends HTMLElementEventMap, GridSelectionColumnCustomEventMap {}

export declare function GridSelectionColumnMixin<TItem, T extends Constructor<HTMLElement>>(
  superclass: T,
): Constructor<GridSelectionColumnMixinClass<TItem>> & T;

export declare class GridSelectionColumnMixinClass<TItem> extends GridSelectionColumnBaseMixinClass<TItem> {}
