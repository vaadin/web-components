/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';

export interface SideNavI18n {
  toggle?: string;
}

export declare function SideNavChildrenMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<SideNavChildrenMixinClass> & Constructor<I18nMixinClass<SideNavI18n>> & T;

export declare class SideNavChildrenMixinClass {
  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following structure and default values:
   * ```js
   * {
   *   toggle: 'Toggle child items'
   * }
   * ```
   */
  i18n: SideNavI18n;

  /**
   * List of child items of this component.
   */
  protected readonly _items: HTMLElement[];

  /**
   * Name of the slot to be used for children.
   */
  protected readonly _itemsSlotName: string;

  /**
   * Count of child items.
   */
  protected _itemsCount: number;
}
