import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { GridModule } from './generated/Grid.js';
import {
  GridColumn as _GridColumn,
  GridColumnModule,
  type GridColumnProps as _GridColumnProps,
} from './generated/GridColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleRenderer } from './renderers/useSimpleRenderer.js';

export type GridColumnProps<TItem> = Omit<_GridColumnProps<TItem>, 'footerRenderer' | 'headerRenderer' | 'renderer'> &
  Readonly<{
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridColumn<TItem = GridModule.GridDefaultItem>(
  props: GridColumnProps<TItem>,
  ref: ForwardedRef<GridColumnModule.GridColumn<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleRenderer(props.headerRenderer);
  const [footerPortals, footerRenderer] = useSimpleRenderer(props.footerRenderer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer);

  return (
    <_GridColumn<TItem>
      {...props}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={ref}
      renderer={bodyRenderer}
    >
      {props.children}
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridColumn>
  );
}

const ForwardedGridColumn = forwardRef(GridColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridColumnProps<TItem> & { ref?: ForwardedRef<GridColumnModule.GridColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridColumn as GridColumn, GridColumnModule };
