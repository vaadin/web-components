export type TextFieldAutoCapitalize = 'on' | 'off' | 'none' | 'characters' | 'words' | 'sentences';

export type TextFieldAutoCorrect = 'on' | 'off';

/**
 * Fired when the `invalid` property changes.
 */
export type TextFieldInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type TextFieldValueChangedEvent = CustomEvent<{ value: string }>;

export interface TextFieldElementEventMap {
  'invalid-changed': TextFieldInvalidChangedEvent;

  'value-changed': TextFieldValueChangedEvent;
}

export interface TextFieldEventMap extends HTMLElementEventMap, TextFieldElementEventMap {}
