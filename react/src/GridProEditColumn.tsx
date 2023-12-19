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
  GridProEditColumn as _GridProEditColumn,
  type GridProEditColumnElement,
  type GridProEditColumnProps as _GridProEditColumnProps,
} from './generated/GridProEditColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';

export * from './generated/GridProEditColumn.js';

export type GridProEditColumnProps<TItem> = Partial<
  Omit<
    _GridProEditColumnProps<TItem>,
    | 'children'
    | 'editModeRenderer'
    | 'footerRenderer'
    | 'header'
    | 'headerRenderer'
    | 'renderer'
    | keyof OmittedGridColumnHTMLAttributes<TItem>
  >
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    editModeRenderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footer?: ReactNode;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    header?: ReactNode;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridProEditColumn<TItem = GridDefaultItem>(
  { children, footer, header, ...props }: GridProEditColumnProps<TItem>,
  ref: ForwardedRef<GridProEditColumnElement<TItem>>,
): ReactElement | null {
  const [editModePortals, editModeRenderer] = useModelRenderer(props.editModeRenderer, {
    renderSync: true,
  });
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header, {
    renderSync: true,
  });
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer, {
    renderSync: true,
  });
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? children, {
    renderSync: true,
  });

  return (
    <_GridProEditColumn<TItem>
      {...props}
      editModeRenderer={editModeRenderer}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={ref}
      renderer={bodyRenderer}
    >
      {editModePortals}
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridProEditColumn>
  );
}

const ForwardedGridProEditColumn = forwardRef(GridProEditColumn) as <TItem = GridDefaultItem>(
  props: GridProEditColumnProps<TItem> & RefAttributes<GridProEditColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridProEditColumn as GridProEditColumn };
