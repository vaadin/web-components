/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/* eslint-disable max-classes-per-file */
import { TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive';
import type { LitRenderer } from '@vaadin/lit-renderer';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import { GridItemModel } from '../vaadin-grid.js';
import { GridColumn } from '../vaadin-grid-column.js';

export type GridColumnBodyLitRenderer<TItem> = (
  item: TItem,
  model: GridItemModel<TItem>,
  column: GridColumn,
) => TemplateResult;

export type GridColumnHeaderLitRenderer = (column: GridColumn) => TemplateResult;
export type GridColumnFooterLitRenderer = (column: GridColumn) => TemplateResult;

declare abstract class AbstractGridColumnRendererDirective<R extends LitRenderer> extends LitRendererDirective<
  GridColumn,
  R
> {
  /**
   * A property to that the renderer callback will be assigned.
   */
  abstract rendererProperty: string;

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
  rendererProperty: string;
}

export declare class GridColumnHeaderRendererDirective extends AbstractGridColumnRendererDirective<GridColumnHeaderLitRenderer> {
  rendererProperty: string;
}

export declare class GridColumnFooterRendererDirective extends AbstractGridColumnRendererDirective<GridColumnFooterLitRenderer> {
  rendererProperty: string;
}

/**
 * A Lit directive for populating the content of the column's body cells.
 *
 * ```js
 * `<vaadin-grid-column
 *   ${columnBodyRenderer((item, model, column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 */
export declare function columnBodyRenderer<TItem>(
  renderer: GridColumnBodyLitRenderer<TItem>,
  value?: unknown,
): DirectiveResult<typeof GridColumnBodyRendererDirective>;

/**
 * A Lit directive for populating the content of the column's header cell.
 *
 * ```js
 * `<vaadin-grid-column
 *   ${columnHeaderRenderer((column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 */
export declare function columnHeaderRenderer(
  renderer: GridColumnHeaderLitRenderer,
  value?: unknown,
): DirectiveResult<typeof GridColumnHeaderRendererDirective>;

/**
 * A Lit directive for populating the content of the column's footer cell.
 *
 * ```js
 * `<vaadin-grid-column
 *   ${columnFooterRenderer((column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 */
export declare function columnFooterRenderer(
  renderer: GridColumnFooterLitRenderer,
  value?: unknown,
): DirectiveResult<typeof GridColumnFooterRendererDirective>;
