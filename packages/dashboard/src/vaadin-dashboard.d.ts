/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type DashboardDragendEvent = CustomEvent;

export interface DashboardCustomEventMap {
  'dashboard-dragend': DashboardDragendEvent;
}

export type DashboardEventMap = DashboardCustomEventMap & HTMLElementEventMap;

/**
 * @fires {CustomEvent} dashboard-dragend - Fired when dragging of a widget ends.
 */
declare class Dashboard extends ElementMixin(ThemableMixin(HTMLElement)) {
  addEventListener<K extends keyof DashboardEventMap>(
    type: K,
    listener: (this: Dashboard, ev: DashboardEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DashboardEventMap>(
    type: K,
    listener: (this: Dashboard, ev: DashboardEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard': Dashboard;
  }
}

export { Dashboard };
