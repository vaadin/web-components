export interface MenuBarItem {
  text?: string;
  component?: string | HTMLElement;
  disabled?: boolean;
  theme?: string | string[];
  children?: SubMenuItem[];
}

export interface SubMenuItem {
  text?: string;
  component?: string | HTMLElement;
  disabled?: boolean;
  checked?: boolean;
  children?: SubMenuItem[];
}

export interface MenuBarI18n {
  moreOptions: string;
}

/**
 * Fired when a submenu item or menu bar button without children is clicked.
 */
export type MenuBarItemSelectedEvent = CustomEvent<{ value: MenuBarItem }>;

export interface MenuBarElementEventMap {
  'item-selected': MenuBarItemSelectedEvent;
}

export interface MenuBarEventMap extends HTMLElementEventMap, MenuBarElementEventMap {}
