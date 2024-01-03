/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * Fired when the `expanded` property changes.
 */
export type GridTreeToggleExpandedChangedEvent = CustomEvent<{ value: boolean }>;

export interface GridTreeToggleCustomEventMap {
  'expanded-changed': GridTreeToggleExpandedChangedEvent;
}

export interface GridTreeToggleEventMap extends HTMLElementEventMap, GridTreeToggleCustomEventMap {}

export declare function GridTreeToggleMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<GridTreeToggleMixinClass> & T;

declare class GridTreeToggleMixinClass {
  /**
   * Current level of the tree represented with a horizontal offset
   * of the toggle button.
   */
  level: number;

  /**
   * Hides the toggle icon and disables toggling a tree sublevel.
   */
  leaf: boolean;

  /**
   * Sublevel toggle state.
   */
  expanded: boolean;
}
