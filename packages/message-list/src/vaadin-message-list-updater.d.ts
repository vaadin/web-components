/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

export interface MessageListItem {
  text?: string;
  time?: string;
  userName?: string;
  userAbbr?: string;
  userImg?: string;
  userColorIndex?: number;
  theme?: string;
}

export class MessageListUpdater {
  items: MessageListItem[];

  constructor(host: HTMLElement, onFocusIn: (FocusEvent) => void);
}
