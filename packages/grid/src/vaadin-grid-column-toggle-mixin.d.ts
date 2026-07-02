/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { GridColumn } from './vaadin-grid-column.js';

/**
 * Fired when the user shows or hides a column through the grid's column
 * toggle menu.
 */
export type GridColumnVisibilityChangedEvent<TItem = any> = CustomEvent<{
  column: GridColumn<TItem>;
  hidden: boolean;
}>;

/**
 * A mixin providing the grid's column toggle: a button in the grid's top
 * (inline-end) corner that opens a menu with one checkbox per hideable leaf
 * column, for showing and hiding columns (a classic "column chooser").
 *
 * The button is only shown while the grid has at least one column with
 * `hideable` set to `true`; with no hideable columns there is nothing to
 * toggle, so the button is hidden automatically.
 */
export declare function GridColumnToggleMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<GridColumnToggleMixinClass> & T;

export declare class GridColumnToggleMixinClass {}
