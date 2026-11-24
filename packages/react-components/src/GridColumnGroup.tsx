/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
import {
  GridColumnGroup as _GridColumnGroup,
  type GridColumnGroupElement,
  type GridColumnGroupProps as _GridColumnGroupProps,
} from './generated/GridColumnGroup.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export * from './generated/GridColumnGroup.js';

export type GridColumnGroupProps = Partial<
  Omit<
    _GridColumnGroupProps,
    'footerRenderer' | 'header' | 'headerRenderer' | keyof OmittedGridColumnHTMLAttributes<any>
  >
> &
  Readonly<{
    footer?: ReactNode;
    /**
     * @deprecated Use `footer` instead.
     */
    footerRenderer?: ComponentType<ReactSimpleRendererProps<GridColumnGroupElement>> | null;
    header?: ReactNode;
    /**
     * @deprecated Use `header` instead.
     */
    headerRenderer?: ComponentType<ReactSimpleRendererProps<GridColumnGroupElement>> | null;
  }>;

function GridColumnGroup(
  { children, footer, header, ...props }: GridColumnGroupProps,
  ref: ForwardedRef<GridColumnGroupElement>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header, {
    renderMode: 'microtask',
  });
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer, {
    renderMode: 'microtask',
  });

  return (
    <_GridColumnGroup {...props} footerRenderer={footerRenderer} headerRenderer={headerRenderer} ref={ref}>
      {headerPortals}
      {footerPortals}
      {children}
    </_GridColumnGroup>
  );
}

const ForwardedGridColumnGroup = forwardRef(GridColumnGroup) as (
  props: GridColumnGroupProps & RefAttributes<GridColumnGroupElement>,
) => ReactElement | null;

export { ForwardedGridColumnGroup as GridColumnGroup };
