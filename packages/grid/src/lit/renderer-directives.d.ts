/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import { Grid, GridItemModel } from '../vaadin-grid.js';

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

export declare function gridRowDetailsRenderer<TItem>(
  renderer: GridRowDetailsLitRenderer<TItem>,
  value?: unknown,
): DirectiveResult<typeof GridRowDetailsRendererDirective>;
