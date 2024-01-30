import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  MenuBar as _MenuBar,
  type MenuBarElement,
  type MenuBarProps as _MenuBarProps,
  type MenuBarItem as _MenuBarItem,
  type SubMenuItem as _SubMenuItem,
} from './generated/MenuBar.js';
import { getOriginalItem, mapItemsWithComponents } from './utils/mapItemsWithComponents.js';

export * from './generated/MenuBar.js';

export type SubMenuItem = Omit<_SubMenuItem, 'component' | 'children'> & {
  component?: ReactElement | string;

  children?: Array<SubMenuItem>;
};

export type MenuBarItem = Omit<_MenuBarItem, 'component' | 'children'> & {
  component?: ReactElement | string;

  children?: Array<SubMenuItem>;
};

export type MenuBarItemSelectedEvent = CustomEvent<{ value: MenuBarItem }>;

export type MenuBarProps = Partial<Omit<_MenuBarProps, 'items' | 'onItemSelected'>> &
  Readonly<{
    items?: Array<MenuBarItem>;

    onItemSelected?: (event: MenuBarItemSelectedEvent) => void;
  }>;

function MenuBar(props: MenuBarProps, ref: ForwardedRef<MenuBarElement>): ReactElement | null {
  const [itemPortals, webComponentItems] = mapItemsWithComponents(props.items, 'vaadin-menu-bar-item');

  const onItemSelected = props.onItemSelected;
  const mappedOnItemSelected = onItemSelected
    ? (event: CustomEvent<{ value: _MenuBarItem }>) => {
        // Replace the mapped web component item with the original item
        Object.assign(event.detail, {
          value: getOriginalItem(event.detail.value),
        });

        onItemSelected(event as CustomEvent<{ value: MenuBarItem }>);
      }
    : undefined;

  return (
    <_MenuBar {...props} ref={ref} items={webComponentItems} onItemSelected={mappedOnItemSelected}>
      {props.children}
      {itemPortals}
    </_MenuBar>
  );
}

const ForwardedMenuBar = forwardRef(MenuBar);

export { ForwardedMenuBar as MenuBar };
