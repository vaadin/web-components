/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export interface RichTextEditorI18n {
  undo: string;
  redo: string;
  bold: string;
  italic: string;
  underline: string;
  strike: string;
  color: string;
  background: string;
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
export type RichTextEditorHtmlValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `value` property changes.
 */
export type RichTextEditorValueChangedEvent = CustomEvent<{ value: string }>;

export interface RichTextEditorCustomEventMap {
  'html-value-changed': RichTextEditorHtmlValueChangedEvent;

  'value-changed': RichTextEditorValueChangedEvent;
}

export declare function RichTextEditorMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<RichTextEditorMixinClass> & T;

export declare class RichTextEditorMixinClass {
  /**
   * Value is a list of the operations which describe change to the document.
   * Each of those operations describe the change at the current index.
   * They can be an `insert`, `delete` or `retain`. The format is as follows:
   *
   * ```js
   *  [
   *    { insert: 'Hello World' },
   *    { insert: '!', attributes: { bold: true }}
   *  ]
   * ```
   *
   * See also https://github.com/quilljs/delta for detailed documentation.
   */
  value: string;

  /**
   * HTML representation of the rich text editor content.
   */
  readonly htmlValue: string | null | undefined;

  /**
   * When true, the user can not modify, nor copy the editor content.
   */
  disabled: boolean;

  /**
   * When true, the user can not modify the editor content, but can copy it.
   */
  readonly: boolean;

  /**
   * An object used to localize this component. The properties are used
   * e.g. as the tooltips for the editor toolbar buttons.
   */
  i18n: RichTextEditorI18n;

  /**
   * The list of colors used by the background and text color
   * selection controls. Should contain an array of HEX strings.
   *
   * When user selects `#000000` (black) as a text color,
   * or `#ffffff` (white) as a background color, it resets
   * the corresponding format for the selected text.
   */
  colorOptions: string[];

  /**
   * Sets content represented by HTML snippet into the editor.
   * The snippet is interpreted by [Quill's Clipboard matchers](https://quilljs.com/docs/modules/clipboard/#matchers),
   * which may not produce the exactly input HTML.
   *
   * **NOTE:** Improper handling of HTML can lead to cross site scripting (XSS) and failure to sanitize
   * properly is both notoriously error-prone and a leading cause of web vulnerabilities.
   * This method is aptly named to ensure the developer has taken the necessary precautions.
   */
  dangerouslySetHtmlValue(htmlValue: string): void;
}
