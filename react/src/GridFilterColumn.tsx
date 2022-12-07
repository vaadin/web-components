import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { WebComponentModule as GridModule } from './generated/Grid.js';
import {
  GridFilterColumn as _GridFilterColumn,
  type GridFilterColumnProps as _GridFilterColumnProps,
  WebComponentModule,
} from './generated/GridFilterColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleRenderer } from './renderers/useSimpleRenderer.js';

export * from './generated/GridFilterColumn.js';

/*
 * According to https://github.com/vaadin/web-components/issues/1485, the
 * `headerRenderer` is not allowed for `vaadin-grid-filter-column`.
 */
export type GridFilterColumnProps<TItem> = Omit<
  _GridFilterColumnProps<TItem>,
  'children' | 'footerRenderer' | 'headerRenderer' | 'renderer'
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridFilterColumn<TItem = GridModule.GridDefaultItem>(
  props: GridFilterColumnProps<TItem>,
  ref: ForwardedRef<WebComponentModule.GridFilterColumn<TItem>>,
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

const ForwardedGridFilterColumn = forwardRef(GridFilterColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridFilterColumnProps<TItem> & { ref?: ForwardedRef<WebComponentModule.GridFilterColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridFilterColumn as GridFilterColumn, WebComponentModule };
