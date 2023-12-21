import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  MenuBar as _MenuBar,
  type MenuBarElement,
  type MenuBarProps as _MenuBarProps,
  type MenuBarItem as _MenuBarItem,
  type SubMenuItem as _SubMenuItem,
} from './generated/MenuBar.js';
import { mapItemsWithComponents } from './utils/mapItemsWithComponents.js';

export * from './generated/MenuBar.js';

export type SubMenuItem = Omit<_SubMenuItem, 'component' | 'children'> & {
  component?: ReactElement | string;

  children?: Array<SubMenuItem>;
};

export type MenuBarItem = Omit<_MenuBarItem, 'component' | 'children'> & {
  component?: ReactElement | string;

  children?: Array<SubMenuItem>;
};

export type MenuBarProps = Partial<Omit<_MenuBarProps, 'items'>> &
  Readonly<{
    items?: Array<MenuBarItem>;
  }>;

function MenuBar(props: MenuBarProps, ref: ForwardedRef<MenuBarElement>): ReactElement | null {
  const [itemPortals, webComponentItems] = mapItemsWithComponents(props.items, 'vaadin-menu-bar-item');

  return (
    <_MenuBar {...props} ref={ref} items={webComponentItems}>
      {props.children}
      {itemPortals}
    </_MenuBar>
  );
}

const ForwardedMenuBar = forwardRef(MenuBar);

export { ForwardedMenuBar as MenuBar };
