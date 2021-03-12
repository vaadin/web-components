export interface RichTextEditorI18n {
  undo: string;
  redo: string;
  bold: string;
  italic: string;
  underline: string;
  strike: string;
  h1: string;
  h2: string;
  h3: string;
  subscript: string;
  superscript: string;
  listOrdered: string;
  listBullet: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  image: string;
  link: string;
  blockquote: string;
  codeBlock: string;
  clean: string;
  linkDialogTitle: string;
  ok: string;
  cancel: string;
  remove: string;
}

/**
 * Fired when the `htmlValue` property changes.
 */
export type RichTextEditorHtmlValueChanged = CustomEvent<{ value: string }>;

/**
 * Fired when the `value` property changes.
 */
export type RichTextEditorValueChanged = CustomEvent<{ value: string }>;

export interface RichTextEditorElementEventMap {
  'html-value-changed': RichTextEditorHtmlValueChanged;

  'value-changed': RichTextEditorValueChanged;
}

export interface RichTextEditorEventMap extends HTMLElementEventMap, RichTextEditorElementEventMap {}
