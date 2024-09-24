/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export interface DashboardItemI18n {
  selectWidgetTitleForEditing: string;
  selectSectionTitleForEditing: string;
  remove: string;
  move: string;
  moveApply: string;
  moveForward: string;
  moveBackward: string;
  resize: string;
  resizeApply: string;
  resizeShrinkWidth: string;
  resizeGrowWidth: string;
  resizeShrinkHeight: string;
  resizeGrowHeight: string;
}

/**
 * Shared functionality between widgets and sections
 */
export declare function DashboardItemMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DashboardItemMixinClass> & T;

export declare class DashboardItemMixinClass {}
