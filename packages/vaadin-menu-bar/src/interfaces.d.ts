export interface MenuBarItem {
  text?: string;
  component?: string | HTMLElement;
  disabled?: boolean;
  children?: SubMenuItem[];
}

export interface SubMenuItem {
  text?: string;
  component?: string | HTMLElement;
  disabled?: boolean;
  checked?: boolean;
  children?: SubMenuItem[];
}

/**
 * Fired when a submenu item or menu bar button without children is clicked.
 */
export type MenuBarItemSelected = CustomEvent<{ value: MenuBarItem }>;

export interface MenuBarElementEventMap {
  'item-selected': MenuBarItemSelected;
}

export interface MenuBarEventMap extends HTMLElementEventMap, MenuBarElementEventMap {}
