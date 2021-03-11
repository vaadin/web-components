export interface MessageInputI18n {
  send: string;
  message: string;
}

export interface MessageListItem {
  text?: string;
  time?: string;
  userName?: string;
  userAbbr?: string;
  userImg?: string;
  userColorIndex?: number;
}

/**
 * Fired when a new message is submitted with `<vaadin-message-input>`, either
 * by clicking the "send" button, or pressing the Enter key.
 */
export type MessageSubmit = CustomEvent<{ value: string }>;

export interface MessageInputElementEventMap {
  submit: MessageSubmit;
}

export interface MessageInputEventMap extends MessageInputElementEventMap, HTMLElementEventMap {}
