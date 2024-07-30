/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type DashboardWidgetOrderChangedEvent = CustomEvent<{ value: number }>;

export type DashboardWidgetColspanChangedEvent = CustomEvent<{ value: number }>;

export type DashboardWidgetRowspanChangedEvent = CustomEvent<{ value: number }>;

export interface DashboardWidgetCustomEventMap {
  'order-changed': DashboardWidgetOrderChangedEvent;

  'colspan-changed': DashboardWidgetColspanChangedEvent;

  'rowspan-changed': DashboardWidgetRowspanChangedEvent;
}

export type DashboardWidgetEventMap = DashboardWidgetCustomEventMap & HTMLElementEventMap;

/**
 * @fires {CustomEvent} order-changed - Fired when the `order` property changes.
 */
declare class DashboardWidget extends ElementMixin(ThemableMixin(HTMLElement)) {
  order: number;

  colspan: number;

  rowspan: number;

  addEventListener<K extends keyof DashboardWidgetEventMap>(
    type: K,
    listener: (this: DashboardWidget, ev: DashboardWidgetEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DashboardWidgetEventMap>(
    type: K,
    listener: (this: DashboardWidget, ev: DashboardWidgetEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-widget': DashboardWidget;
  }
}

export { DashboardWidget };
