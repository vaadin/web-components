/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { TemplateResult } from 'lit';
import type { DirectiveResult } from 'lit/directive';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import type { Grid, GridItemModel } from '../vaadin-grid.js';

export type GridRowDetailsLitRenderer<TItem> = (item: TItem, model: GridItemModel<TItem>, grid: Grid) => TemplateResult;

export declare class GridRowDetailsRendererDirective<TItem> extends LitRendererDirective<
  Grid,
  GridRowDetailsLitRenderer<TItem>
> {
  /**
   * Adds the row details renderer callback to the grid.
   */
  addRenderer(): void;

  /**
   * Runs the row details renderer callback on the grid.
   */
  runRenderer(): void;

  /**
   * Removes the row details renderer callback from the grid.
   */
  removeRenderer(): void;
}

/**
 * A Lit directive for rendering the content of the row details cell.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the grid
 * via the `rowDetailsRenderer` property. The renderer is called for each grid item that is in `detailsOpened`
 * when assigned and whenever a single dependency or an array of dependencies changes.
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
 * `<vaadin-grid
 *   ${gridRowDetailsRenderer((item, model, grid) => html`...`)}
 * ></vaadin-grid>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export declare function gridRowDetailsRenderer<TItem>(
  renderer: GridRowDetailsLitRenderer<TItem>,
  dependencies?: unknown,
): DirectiveResult<typeof GridRowDetailsRendererDirective>;
