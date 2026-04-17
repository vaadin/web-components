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

export declare class BreadcrumbMixinClass {
  /**
   * An array of item objects to render as breadcrumb items.
   * Each object can have: `text` (string), `path` (string), `current` (boolean).
   * When set, programmatic items are created in the light DOM.
   * Setting to `null` or `undefined` clears programmatic items.
   */
  items: BreadcrumbItemData[] | null | undefined;

  /**
   * The array of slotted breadcrumb items.
   */
  protected _items: Element[];

  /**
   * The number of slotted items.
   */
  protected _itemCount: number;
}
