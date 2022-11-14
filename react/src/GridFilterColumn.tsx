import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { GridModule } from './generated/Grid.js';
import {
  GridFilterColumn as _GridFilterColumn,
  GridFilterColumnModule,
  type GridFilterColumnProps as _GridFilterColumnProps,
} from './generated/GridFilterColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleRenderer } from './renderers/useSimpleRenderer.js';

export type GridFilterColumnProps<TItem> = Omit<
  _GridFilterColumnProps<TItem>,
  'children' | 'footerRenderer' | 'headerRenderer' | 'renderer'
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridFilterColumn<TItem = GridModule.GridDefaultItem>(
  props: GridFilterColumnProps<TItem>,
  ref: ForwardedRef<GridFilterColumnModule.GridFilterColumn<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleRenderer(props.headerRenderer);
  const [footerPortals, footerRenderer] = useSimpleRenderer(props.footerRenderer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_GridFilterColumn<TItem>
      {...props}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={ref}
      renderer={bodyRenderer}
    >
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridFilterColumn>
  );
}

const ForwardedGridFilterColumn = forwardRef(GridFilterColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridFilterColumnProps<TItem> & { ref?: ForwardedRef<GridFilterColumnModule.GridFilterColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridFilterColumn as GridFilterColumn, GridFilterColumnModule };
