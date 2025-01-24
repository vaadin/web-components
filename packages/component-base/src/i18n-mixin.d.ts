/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * A mixin that allows to set partial I18N properties.
 */
export declare function I18nMixin<T extends Constructor<HTMLElement>, I>(
  superclass: T,
  defaultI18n: I,
): Constructor<I18nMixinClass<I>> & T;

export declare class I18nMixinClass<I> {
  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   */
  i18n: DeepPartial<I>;
}
