import type { WebComponentModule as GridModule } from '../generated/Grid.js';
import type { WebComponentModule as GridColumnModule } from '../generated/GridColumn.js';
import type { ReactModelRendererProps } from "./useModelRenderer.js";
import type { ReactSimpleRendererProps } from "./useSimpleRenderer.js";

export type GridRowDetailsReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  GridModule.GridItemModel<TItem>,
  GridModule.Grid<TItem>
>;

export type GridBodyReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  GridModule.GridItemModel<TItem>,
  GridColumnModule.GridColumn<TItem>
>;


export type GridEdgeReactRendererProps<TItem> = ReactSimpleRendererProps<GridColumnModule.GridColumn<TItem>>;
