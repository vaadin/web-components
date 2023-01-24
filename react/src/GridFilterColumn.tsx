import { ComponentType, type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import {
  GridFilterColumn as _GridFilterColumn,
  type GridFilterColumnElement,
  type GridFilterColumnProps as _GridFilterColumnProps,
} from './generated/GridFilterColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleRenderer } from './renderers/useSimpleRenderer.js';

export * from './generated/GridFilterColumn.js';

/*
 * According to https://github.com/vaadin/web-components/issues/1485, the
 * `headerRenderer` is not allowed for `vaadin-grid-filter-column`.
 */
export type GridFilterColumnProps<TItem> = Partial<
  Omit<_GridFilterColumnProps<TItem>, 'children' | 'footerRenderer' | 'headerRenderer' | 'renderer'>
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridFilterColumn<TItem = GridDefaultItem>(
  props: GridFilterColumnProps<TItem>,
  ref: ForwardedRef<GridFilterColumnElement<TItem>>,
): ReactElement | null {
  const [footerPortals, footerRenderer] = useSimpleRenderer(props.footerRenderer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_GridFilterColumn<TItem> {...props} footerRenderer={footerRenderer} ref={ref} renderer={bodyRenderer}>
      {footerPortals}
      {bodyPortals}
    </_GridFilterColumn>
  );
}

const ForwardedGridFilterColumn = forwardRef(GridFilterColumn) as <TItem = GridDefaultItem>(
  props: GridFilterColumnProps<TItem> & RefAttributes<GridFilterColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridFilterColumn as GridFilterColumn };
