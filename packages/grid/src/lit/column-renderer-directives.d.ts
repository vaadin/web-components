/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/* eslint-disable max-classes-per-file */
import type { DirectiveResult } from 'lit/directive.js';
import type { LitRenderer, LitRendererResult } from '@vaadin/lit-renderer';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import type { GridItemModel } from '../vaadin-grid.js';
import type { GridColumn } from '../vaadin-grid-column.js';

export type GridColumnBodyLitRenderer<TItem> = (
  item: TItem,
  model: GridItemModel<TItem>,
  column: GridColumn,
) => LitRendererResult;

export type GridColumnHeaderLitRenderer = (column: GridColumn) => LitRendererResult;
export type GridColumnFooterLitRenderer = (column: GridColumn) => LitRendererResult;

declare abstract class AbstractGridColumnRendererDirective<R extends LitRenderer> extends LitRendererDirective<
  GridColumn,
  R
> {
  /**
   * A property to that the renderer callback will be assigned.
   */
  abstract rendererProperty: 'footerRenderer' | 'headerRenderer' | 'renderer';

  /**
   * Adds the renderer callback to the grid column.
   */
  addRenderer(): void;

  /**
   * Runs the renderer callback on the grid column.
   */
  runRenderer(): void;

  /**
   * Removes the renderer callback from the grid column.
   */
  removeRenderer(): void;
}

export declare class GridColumnBodyRendererDirective<TItem> extends AbstractGridColumnRendererDirective<
  GridColumnBodyLitRenderer<TItem>
> {
  rendererProperty: 'renderer';
}

export declare class GridColumnHeaderRendererDirective extends AbstractGridColumnRendererDirective<GridColumnHeaderLitRenderer> {
  rendererProperty: 'headerRenderer';
}

export declare class GridColumnFooterRendererDirective extends AbstractGridColumnRendererDirective<GridColumnFooterLitRenderer> {
  rendererProperty: 'footerRenderer';
}

/**
 * A Lit directive for rendering the content of the column's body cells.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the grid column
 * via the `renderer` property. The renderer is called for each column's body cell when assigned and whenever
 * a single dependency or an array of dependencies changes.
 * It is not guaranteed that the renderer will be called immediately (synchronously) in both cases.
 *
 * Dependencies can be a single value or an array of values.
 * Values are checked against previous values with strict equality (`===`),
 * so the check won't detect nested property changes inside objects or arrays.
 * When dependencies are provided as an array, each item is checked against the previous value
 * at the same index with strict equality. Nested arrays are also checked only by strict
 * equality.
 *
 * Example of usage:
 * ```js
 * `<vaadin-grid-column
 *   ${columnBodyRenderer((item, model, column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export declare function columnBodyRenderer<TItem>(
  renderer: GridColumnBodyLitRenderer<TItem>,
  dependencies?: unknown,
): DirectiveResult<typeof GridColumnBodyRendererDirective>;

/**
 * A Lit directive for rendering the content of the column's header cell.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the grid column
 * via the `headerRenderer` property. The renderer is called once when assigned and whenever
 * a single dependency or an array of dependencies changes.
 * It is not guaranteed that the renderer will be called immediately (synchronously) in both cases.
 *
 * Dependencies can be a single value or an array of values.
 * Values are checked against previous values with strict equality (`===`),
 * so the check won't detect nested property changes inside objects or arrays.
 * When dependencies are provided as an array, each item is checked against the previous value
 * at the same index with strict equality. Nested arrays are also checked only by strict
 * equality.
 *
 * Example of usage:
 * ```js
 * `<vaadin-grid-column
 *   ${columnHeaderRenderer((column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export declare function columnHeaderRenderer(
  renderer: GridColumnHeaderLitRenderer,
  dependencies?: unknown,
): DirectiveResult<typeof GridColumnHeaderRendererDirective>;

/**
 * A Lit directive for rendering the content of the column's footer cell.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the grid column
 * via the `footerRenderer` property. The renderer is called once when assigned and whenever
 * a single dependency or an array of dependencies changes.
 * It is not guaranteed that the renderer will be called immediately (synchronously) in both cases.
 *
 * Dependencies can be a single value or an array of values.
 * Values are checked against previous values with strict equality (`===`),
 * so the check won't detect nested property changes inside objects or arrays.
 * When dependencies are provided as an array, each item is checked against the previous value
 * at the same index with strict equality. Nested arrays are also checked only by strict
 * equality.
 *
 * Example of usage:
 * ```js
 * `<vaadin-grid-column
 *   ${columnFooterRenderer((column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export declare function columnFooterRenderer(
  renderer: GridColumnFooterLitRenderer,
  dependencies?: unknown,
): DirectiveResult<typeof GridColumnFooterRendererDirective>;
