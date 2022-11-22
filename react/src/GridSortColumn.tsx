import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { WebComponentModule as GridModule } from './generated/Grid.js';
import {
  GridSortColumn as _GridSortColumn,
  WebComponentModule,
  type GridSortColumnProps as _GridSortColumnProps,
} from './generated/GridSortColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleRenderer } from './renderers/useSimpleRenderer.js';

export type GridSortColumnProps<TItem> = Omit<
  _GridSortColumnProps<TItem>,
  'children' | 'footerRenderer' | 'headerRenderer' | 'renderer'
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridSortColumn<TItem = GridModule.GridDefaultItem>(
  props: GridSortColumnProps<TItem>,
  ref: ForwardedRef<WebComponentModule.GridSortColumn<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleRenderer(props.headerRenderer);
  const [footerPortals, footerRenderer] = useSimpleRenderer(props.footerRenderer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_GridSortColumn<TItem>
      {...props}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={ref}
      renderer={bodyRenderer}
    >
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridSortColumn>
  );
}

const ForwardedGridSortColumn = forwardRef(GridSortColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridSortColumnProps<TItem> & { ref?: ForwardedRef<WebComponentModule.GridSortColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridSortColumn as GridSortColumn, WebComponentModule };
