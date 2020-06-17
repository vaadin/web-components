import { ContextMenuElement } from '../src/vaadin-context-menu.js';

export interface ContextMenuItem {
  text?: string;
  component?: string | HTMLElement;
  disabled?: boolean;
  checked?: boolean;
  children?: ContextMenuItem[];
}

export interface ContextMenuRendererContext {
  target: HTMLElement;
  detail?: object;
}

export type ContextMenuRenderer = (
  root: HTMLElement,
  contextMenu?: ContextMenuElement,
  context?: ContextMenuRendererContext
) => void;
