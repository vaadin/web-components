import type { VirtualListDefaultItem } from '@vaadin/virtual-list/src/vaadin-virtual-list.js';
import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  VirtualList as _VirtualList,
  type VirtualListProps as _VirtualListProps,
  WebComponentModule,
} from './generated/VirtualList.js';
import { type ReactModelRendererProps, useModelRenderer } from './renderers/useModelRenderer.js';

export * from './generated/VirtualList.js';

export type VirtualListReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  WebComponentModule.VirtualListItemModel<TItem>,
  WebComponentModule.VirtualList<TItem>
>;

export type VirtualListProps<TItem> = Omit<_VirtualListProps<TItem>, 'children' | 'renderer'> &
  Readonly<{
    children?: ComponentType<VirtualListReactRendererProps<TItem>> | null;
    renderer?: ComponentType<VirtualListReactRendererProps<TItem>> | null;
  }>;

function VirtualList<TItem = VirtualListDefaultItem>(
  props: VirtualListProps<TItem>,
  ref: ForwardedRef<WebComponentModule.VirtualList<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_VirtualList<TItem> {...props} ref={ref} renderer={renderer}>
      {portals}
    </_VirtualList>
  );
}

const ForwardedVirtualList = forwardRef(VirtualList) as <TItem = VirtualListDefaultItem>(
  props: VirtualListProps<TItem> & { ref?: ForwardedRef<WebComponentModule.VirtualList<TItem>> },
) => ReactElement | null;

export { ForwardedVirtualList as VirtualList, WebComponentModule };
