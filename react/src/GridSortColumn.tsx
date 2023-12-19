import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import {
  GridSortColumn as _GridSortColumn,
  type GridSortColumnElement,
  type GridSortColumnProps as _GridSortColumnProps,
} from './generated/GridSortColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';

export * from './generated/GridSortColumn.js';

/*
 * The `headerRenderer` is not allowed for `vaadin-grid-sort-column`.
 */
export type GridSortColumnProps<TItem> = Partial<
  Omit<
    _GridSortColumnProps<TItem>,
    'children' | 'footerRenderer' | 'headerRenderer' | 'renderer' | keyof OmittedGridColumnHTMLAttributes<TItem>
  >
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footer?: ReactNode;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridSortColumn<TItem = GridDefaultItem>(
  { footer, ...props }: GridSortColumnProps<TItem>,
  ref: ForwardedRef<GridSortColumnElement<TItem>>,
): ReactElement | null {
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_GridSortColumn<TItem> {...props} footerRenderer={footerRenderer} ref={ref} renderer={bodyRenderer}>
      {footerPortals}
      {bodyPortals}
    </_GridSortColumn>
  );
}

const ForwardedGridSortColumn = forwardRef(GridSortColumn) as <TItem = GridDefaultItem>(
  props: GridSortColumnProps<TItem> & RefAttributes<GridSortColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridSortColumn as GridSortColumn };
