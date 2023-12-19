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
  GridSelectionColumn as _GridSelectionColumn,
  type GridSelectionColumnElement,
  type GridSelectionColumnProps as _GridSelectionColumnProps,
} from './generated/GridSelectionColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import { useSimpleRenderer } from './renderers/useSimpleRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';

export * from './generated/GridSelectionColumn.js';

export type GridSelectionColumnProps<TItem> = Partial<
  Omit<
    _GridSelectionColumnProps<TItem>,
    'children' | 'footerRenderer' | 'headerRenderer' | 'renderer' | keyof OmittedGridColumnHTMLAttributes<TItem>
  >
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footer?: ReactNode;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridSelectionColumn<TItem = GridDefaultItem>(
  { footer, ...props }: GridSelectionColumnProps<TItem>,
  ref: ForwardedRef<GridSelectionColumnElement<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleRenderer(props.headerRenderer, {
    renderSync: true,
  });
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer, {
    renderSync: true,
  });
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? props.children, {
    renderSync: true,
  });

  return (
    <_GridSelectionColumn<TItem>
      {...props}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={ref}
      renderer={bodyRenderer}
    >
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridSelectionColumn>
  );
}

const ForwardedGridSelectionColumn = forwardRef(GridSelectionColumn) as <TItem = GridDefaultItem>(
  props: GridSelectionColumnProps<TItem> & RefAttributes<GridSelectionColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridSelectionColumn as GridSelectionColumn };
