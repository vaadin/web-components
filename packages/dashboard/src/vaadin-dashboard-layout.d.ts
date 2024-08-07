/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type DashboardLayoutEventMap = HTMLElementEventMap;

declare class DashboardLayout extends ElementMixin(ThemableMixin(HTMLElement)) {
  dense: boolean;

  addEventListener<K extends keyof DashboardLayoutEventMap>(
    type: K,
    listener: (this: DashboardLayout, ev: DashboardLayoutEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DashboardLayoutEventMap>(
    type: K,
    listener: (this: DashboardLayout, ev: DashboardLayoutEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-layout': DashboardLayout;
  }
}

export { DashboardLayout };
