/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';

export interface MessageInputI18n {
  send?: string;
  message?: string;
}

export declare function MessageInputMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<I18nMixinClass<MessageInputI18n>> & Constructor<MessageInputMixinClass> & T;

export declare class MessageInputMixinClass {
  /**
   * Current content of the text input field
   */
  value: string | null | undefined;

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   * ```js
   * {
   *   // Used as the button label
   *   send: 'Send',
   *
   *   // Used as the input field's placeholder and aria-label
   *   message: 'Message'
   * }
   * ```
   */
  i18n: MessageInputI18n;

  /**
   * Set to true to disable this element.
   */
  disabled: boolean;
}
