import type { VirtualListDefaultItem } from '@vaadin/virtual-list/src/vaadin-virtual-list.js';
import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  VirtualList as _VirtualList,
  VirtualListModule,
  type VirtualListProps as _VirtualListProps,
} from './generated/VirtualList.js';
import { useModelRenderer, type ReactModelRendererProps } from './renderers/useModelRenderer.js';

export type VirtualListReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  VirtualListModule.VirtualListItemModel<TItem>,
  VirtualListModule.VirtualList<TItem>
>;

export type VirtualListProps<TItem> = Omit<_VirtualListProps<TItem>, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<VirtualListReactRendererProps<TItem>> | null;
  }>;

function VirtualList<TItem = VirtualListDefaultItem>(
  props: VirtualListProps<TItem>,
  ref: ForwardedRef<VirtualListModule.VirtualList<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer);

  return (
    <_VirtualList<TItem> {...props} ref={ref} renderer={renderer}>
      {props.children}
      {portals}
    </_VirtualList>
  );
}

const ForwardedVirtualList = forwardRef(VirtualList) as <TItem = VirtualListDefaultItem>(
  props: VirtualListProps<TItem> & { ref?: ForwardedRef<VirtualListModule.VirtualList<TItem>> },
) => ReactElement | null;

export { ForwardedVirtualList as VirtualList, VirtualListModule };
