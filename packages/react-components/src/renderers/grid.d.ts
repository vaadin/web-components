/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { GridElement, GridItemModel } from '../generated/Grid.js';
import type { GridColumnElement } from '../generated/GridColumn.js';
import type { ReactModelRendererProps } from './useModelRenderer.js';
import type { ReactSimpleRendererProps } from './useSimpleRenderer.js';

export type GridRowDetailsReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  GridItemModel<TItem>,
  GridElement<TItem>
>;

export type GridBodyReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  GridItemModel<TItem>,
  GridColumnElement<TItem>
>;

export type GridEdgeReactRendererProps<TItem> = ReactSimpleRendererProps<GridColumnElement<TItem>>;
