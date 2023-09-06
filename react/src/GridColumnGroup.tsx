import { forwardRef, type ComponentType, type ForwardedRef, type ReactElement, type RefAttributes } from 'react';
import {
  GridColumnGroup as _GridColumnGroup,
  type GridColumnGroupElement,
  type GridColumnGroupProps as _GridColumnGroupProps,
} from './generated/GridColumnGroup.js';
import { useSimpleRenderer, type ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export * from './generated/GridColumnGroup.js';

export type GridColumnGroupProps = Partial<Omit<_GridColumnGroupProps, 'footerRenderer' | 'headerRenderer'>> &
  Readonly<{
    footerRenderer?: ComponentType<ReactSimpleRendererProps<GridColumnGroupElement>> | null;
    headerRenderer?: ComponentType<ReactSimpleRendererProps<GridColumnGroupElement>> | null;
  }>;

function GridColumnGroup(props: GridColumnGroupProps, ref: ForwardedRef<GridColumnGroupElement>): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleRenderer(props.headerRenderer);
  const [footerPortals, footerRenderer] = useSimpleRenderer(props.footerRenderer);

  return (
    <_GridColumnGroup {...props} footerRenderer={footerRenderer} headerRenderer={headerRenderer} ref={ref}>
      {headerPortals}
      {footerPortals}
      {props.children}
    </_GridColumnGroup>
  );
}

const ForwardedGridColumnGroup = forwardRef(GridColumnGroup) as (
  props: GridColumnGroupProps & RefAttributes<GridColumnGroupElement>,
) => ReactElement | null;

export { ForwardedGridColumnGroup as GridColumnGroup };
