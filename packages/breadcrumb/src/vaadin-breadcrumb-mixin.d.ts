/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * Data shape for an entry in the breadcrumb `items` array.
 */
export interface BreadcrumbItemData {
  /**
   * Text content of the breadcrumb item.
   */
  text: string;
  /**
   * URL the item links to. When omitted, the item renders as a non-interactive
   * `<span>` (used for the current page).
   */
  path?: string;
}

/**
 * A mixin providing common `<vaadin-breadcrumb>` functionality.
 */
export declare function BreadcrumbMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<BreadcrumbMixinClass> & T;

export declare class BreadcrumbMixinClass {
  /**
   * Programmatic items array. When set, the breadcrumb generates
   * `<vaadin-breadcrumb-item>` elements in the light DOM, replacing any
   * pre-existing slotted children. Each entry has the shape
   * `{ text: string, path?: string }`. Entries with `path` produce a linked
   * item; entries without `path` produce a non-interactive item (typically
   * the current page).
   *
   * Setting `items` to `null` or `undefined` removes the generated items and
   * restores any author-supplied light-DOM children that were present before
   * `items` was first set.
   */
  items?: BreadcrumbItemData[] | null;
}
