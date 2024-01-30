import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  ContextMenu as _ContextMenu,
  type ContextMenuRendererContext,
  type ContextMenuElement,
  type ContextMenuProps as _ContextMenuProps,
  type ContextMenuItem as _ContextMenuItem,
} from './generated/ContextMenu.js';
import { type ReactContextRendererProps, useContextRenderer } from './renderers/useContextRenderer.js';
import { getOriginalItem, mapItemsWithComponents } from './utils/mapItemsWithComponents.js';

export * from './generated/ContextMenu.js';

export type ContextMenuReactRendererProps = ReactContextRendererProps<ContextMenuRendererContext, ContextMenuElement>;

export type ContextMenuItem = Omit<_ContextMenuItem, 'component' | 'children'> & {
  component?: ReactElement | string;

  children?: Array<ContextMenuItem>;
};

export type ContextMenuItemSelectedEvent = CustomEvent<{ value: ContextMenuItem }>;

// The 'opened' property is omitted because it is readonly in the web component.
// So you cannot set it up manually, only read from the component.
// For changing the property, use specific methods of the component.
export type ContextMenuProps = Partial<Omit<_ContextMenuProps, 'opened' | 'renderer' | 'items' | 'onItemSelected'>> &
  Readonly<{
    renderer?: ComponentType<ContextMenuReactRendererProps> | null;

    items?: Array<ContextMenuItem>;

    onItemSelected?: (event: ContextMenuItemSelectedEvent) => void;
  }>;

function ContextMenu(props: ContextMenuProps, ref: ForwardedRef<ContextMenuElement>): ReactElement | null {
  const [portals, renderer] = useContextRenderer(props.renderer);
  const [itemPortals, webComponentItems] = mapItemsWithComponents(props.items, 'vaadin-context-menu-item');

  const onItemSelected = props.onItemSelected;
  const mappedOnItemSelected = onItemSelected
    ? (event: CustomEvent<{ value: _ContextMenuItem }>) => {
        // Replace the mapped web component item with the original item
        Object.assign(event.detail, {
          value: getOriginalItem(event.detail.value),
        });

        onItemSelected(event as CustomEvent<{ value: ContextMenuItem }>);
      }
    : undefined;
  return (
    <_ContextMenu
      {...props}
      ref={ref}
      renderer={renderer}
      items={webComponentItems}
      onItemSelected={mappedOnItemSelected}
    >
      {props.children}
      {portals}
      {itemPortals}
    </_ContextMenu>
  );
}

const ForwardedContextMenu = forwardRef(ContextMenu);

export { ForwardedContextMenu as ContextMenu };
