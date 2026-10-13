/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import { type ReactModelRendererProps, useModelRenderer } from '@vaadin/react-components/renderers/useModelRenderer.js';
import {
  Dashboard as _Dashboard,
  type DashboardElement,
  type DashboardItem,
  type DashboardItemModel,
  type DashboardProps as _DashboardProps,
} from './generated/Dashboard.js';

export * from './generated/Dashboard.js';

export type DashboardReactRendererProps<TItem extends DashboardItem> = ReactModelRendererProps<
  TItem,
  DashboardItemModel<TItem>,
  DashboardElement<TItem>
>;

export type DashboardProps<TItem extends DashboardItem> = Partial<
  Omit<_DashboardProps<TItem>, 'children' | 'renderer'>
> &
  Readonly<{
    children?: ComponentType<DashboardReactRendererProps<TItem>> | null;
    renderer?: ComponentType<DashboardReactRendererProps<TItem>> | null;
  }>;

function Dashboard<TItem extends DashboardItem = DashboardItem>(
  props: DashboardProps<TItem>,
  ref: ForwardedRef<DashboardElement<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_Dashboard<TItem> {...props} ref={ref} renderer={renderer as any}>
      {portals}
    </_Dashboard>
  );
}

const ForwardedDashboard = forwardRef(Dashboard) as <TItem extends DashboardItem = DashboardItem>(
  props: DashboardProps<TItem> & RefAttributes<DashboardElement<TItem>>,
) => ReactElement | null;

export { ForwardedDashboard as Dashboard };
