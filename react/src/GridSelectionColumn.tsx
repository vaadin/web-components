import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { WebComponentModule as GridModule } from './generated/Grid.js';
import {
  GridSelectionColumn as _GridSelectionColumn,
  WebComponentModule,
  type GridSelectionColumnProps as _GridSelectionColumnProps,
} from './generated/GridSelectionColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleRenderer } from './renderers/useSimpleRenderer.js';

export type GridSelectionColumnProps<TItem> = Omit<
  _GridSelectionColumnProps<TItem>,
  'children' | 'footerRenderer' | 'headerRenderer' | 'renderer'
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridSelectionColumn<TItem = GridModule.GridDefaultItem>(
  props: GridSelectionColumnProps<TItem>,
  ref: ForwardedRef<WebComponentModule.GridSelectionColumn<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleRenderer(props.headerRenderer);
  const [footerPortals, footerRenderer] = useSimpleRenderer(props.footerRenderer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? props.children);

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

const ForwardedGridSelectionColumn = forwardRef(GridSelectionColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridSelectionColumnProps<TItem> & { ref?: ForwardedRef<WebComponentModule.GridSelectionColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridSelectionColumn as GridSelectionColumn, WebComponentModule };
