/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';

export interface MessageListItem {
  text?: string;
  time?: string;
  userName?: string;
  userAbbr?: string;
  userImg?: string;
  userColorIndex?: number;
  theme?: string;
  className?: string;
}

export declare function MessageListMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<KeyboardDirectionMixinClass> & Constructor<MessageListMixinClass> & T;

export declare class MessageListMixinClass {
  /**
   * An array of objects which will be rendered as messages.
   * The message objects can have the following properties:
   * ```js
   * Array<{
   *   text: string,
   *   time: string,
   *   userName: string,
   *   userAbbr: string,
   *   userImg: string,
   *   userColorIndex: number,
   *   className: string,
   *   theme: string
   * }>
   * ```
   */
  items: MessageListItem[] | null | undefined;
}
