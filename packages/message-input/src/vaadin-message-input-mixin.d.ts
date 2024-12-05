/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';

export interface MessageInputI18n {
  send: string;
  message: string;
}

export declare function MessageInputMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> & Constructor<MessageInputMixinClass> & T;

export declare class MessageInputMixinClass {
  /**
   * Current content of the text input field
   */
  value: string | null | undefined;

  /**
   * The object used to localize this component.
   * For changing the default localization, change the entire
   * `i18n` object.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
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
