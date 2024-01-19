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
  GridFilterColumn as _GridFilterColumn,
  type GridFilterColumnElement,
  type GridFilterColumnProps as _GridFilterColumnProps,
} from './generated/GridFilterColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';

export * from './generated/GridFilterColumn.js';

/*
 * According to https://github.com/vaadin/web-components/issues/1485, the
 * `headerRenderer` is not allowed for `vaadin-grid-filter-column`.
 */
export type GridFilterColumnProps<TItem> = Partial<
  Omit<
    _GridFilterColumnProps<TItem>,
    'children' | 'footerRenderer' | 'headerRenderer' | 'renderer' | keyof OmittedGridColumnHTMLAttributes<TItem>
  >
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footer?: ReactNode;
    /**
     * @deprecated Use `footer` instead.
     */
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridFilterColumn<TItem = GridDefaultItem>(
  { footer, ...props }: GridFilterColumnProps<TItem>,
  ref: ForwardedRef<GridFilterColumnElement<TItem>>,
): ReactElement | null {
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer, {
    renderSync: true,
  });
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? props.children, {
    renderSync: true,
  });

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
