import { type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import {
  MenuBar as _MenuBar,
  type MenuBarElement,
  type MenuBarProps as _MenuBarProps,
  type MenuBarItem as _MenuBarItem,
  type SubMenuItem as _SubMenuItem,
} from './generated/MenuBar.js';
import { getOriginalItem, mapItemsWithComponents } from './utils/mapItemsWithComponents.js';

export * from './generated/MenuBar.js';

export type SubMenuItem<TItemData extends object = object> = Omit<_SubMenuItem<TItemData>, 'component' | 'children'> & {
  component?: ReactElement | string;

  children?: Array<SubMenuItem<TItemData>>;
};

export type MenuBarItem<TItemData extends object = object> = Omit<_MenuBarItem<TItemData>, 'component' | 'children'> & {
  component?: ReactElement | string;

  children?: Array<SubMenuItem<TItemData>>;
};

export type MenuBarItemSelectedEvent<TItem extends MenuBarItem = MenuBarItem> = CustomEvent<{ value: MenuBarItem<TItem> }>;

export type MenuBarProps<TItem extends MenuBarItem = MenuBarItem> = Partial<Omit<_MenuBarProps, 'items' | 'onItemSelected'>> &
  Readonly<{
    items?: Array<TItem>;

    onItemSelected?: (event: MenuBarItemSelectedEvent<TItem>) => void;
  }>;

function MenuBar<TItem extends MenuBarItem = MenuBarItem>(props: MenuBarProps<TItem>, ref: ForwardedRef<MenuBarElement>): ReactElement | null {
  const [itemPortals, webComponentItems] = mapItemsWithComponents(props.items, 'vaadin-menu-bar-item');

  const onItemSelected = props.onItemSelected;
  const mappedOnItemSelected = onItemSelected
    ? (event: CustomEvent<{ value: _MenuBarItem }>) => {
        // Replace the mapped web component item with the original item
        Object.assign(event.detail, {
          value: getOriginalItem(event.detail.value),
        });

        onItemSelected(event as MenuBarItemSelectedEvent<TItem>);
      }
    : undefined;

  return (
    <_MenuBar {...props} ref={ref} items={webComponentItems} onItemSelected={mappedOnItemSelected}>
      {props.children}
      {itemPortals}
    </_MenuBar>
  );
}

const ForwardedMenuBar = forwardRef(MenuBar) as <TItem extends MenuBarItem = MenuBarItem>(
  props: MenuBarProps<TItem> & RefAttributes<MenuBarElement>,
) => ReactElement | null;

export { ForwardedMenuBar as MenuBar };
