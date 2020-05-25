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
