export type TextFieldAutoCapitalize =
  | 'on'
  | 'off'
  | 'none'
  | 'characters'
  | 'words'
  | 'sentences';

export type TextFieldAutoCorrect = 'on' | 'off';

/**
 * Fired when the `invalid` property changes.
 */
export type TextFieldInvalidChanged = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type TextFieldValueChanged = CustomEvent<{ value: string }>;

export interface TextFieldElementEventMap {
  'invalid-changed': TextFieldInvalidChanged;

  'value-changed': TextFieldValueChanged;
}

export interface TextFieldEventMap extends HTMLElementEventMap, TextFieldElementEventMap {}
