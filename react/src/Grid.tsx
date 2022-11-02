import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import { Grid as _Grid, GridModule, type GridProps as _GridProps } from './generated/Grid.js';
import type { GridRowDetailsReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from "./renderers/useModelRenderer.js";

export type GridProps<TItem> = Omit<_GridProps<TItem>, 'rowDetailsRenderer'> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

function Grid<TItem = GridModule.GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<GridModule.Grid<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer);

  return (
    <_Grid<TItem>
      {...props}
      ref={ref}
      // TODO: remove cast after the nullability issue is fixed
      rowDetailsRenderer={rowDetailsRenderer as GridModule.GridRowDetailsRenderer<TItem>}
    >
      {props.children}
      {portals}
    </_Grid>
  );
}

const ForwardedGrid = forwardRef(Grid) as <TItem = GridModule.GridDefaultItem>(
  props: GridProps<TItem> & { ref?: ForwardedRef<GridModule.Grid<TItem>> },
) => ReactElement | null;

export { ForwardedGrid as Grid, GridModule };
