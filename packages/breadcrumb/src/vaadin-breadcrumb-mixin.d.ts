/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function BreadcrumbMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<BreadcrumbMixinClass> & T;

export interface BreadcrumbItemData {
  text: string;
  path?: string;
  current?: boolean;
}

export interface BreadcrumbNavigateDetail {
  path: string;
  current: boolean;
  originalEvent: Event;
}

export declare class BreadcrumbMixinClass {
  /**
   * An array of item objects to render as breadcrumb items.
   * Each object can have: `text` (string), `path` (string), `current` (boolean).
   * When set, programmatic items are created in the light DOM.
   * Setting to `null` or `undefined` clears programmatic items.
   */
  items: BreadcrumbItemData[] | null | undefined;

  /**
   * A callback function that is called when navigating to a breadcrumb item.
   * Receives an object with `{ path, current, originalEvent }`.
   * When set, the default link action is prevented unless the callback returns `false`.
   * When not set, a `navigate` CustomEvent is dispatched instead.
   */
  onNavigate: ((detail: BreadcrumbNavigateDetail) => boolean | undefined) | null | undefined;

  /**
   * A change to this property triggers a `breadcrumb-location-changed` window event.
   * The specific value is irrelevant; any change dispatches the event.
   */
  location: any;

  /**
   * The array of slotted breadcrumb items.
   */
  protected _items: Element[];

  /**
   * The number of slotted items.
   */
  protected _itemCount: number;
}
