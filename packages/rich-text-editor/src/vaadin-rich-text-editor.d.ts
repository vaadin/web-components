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
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { type RichTextEditorCustomEventMap, RichTextEditorMixin } from './vaadin-rich-text-editor-mixin.js';
export * from './vaadin-rich-text-editor-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type RichTextEditorChangeEvent = Event & {
  target: RichTextEditor;
};

export interface RichTextEditorEventMap extends HTMLElementEventMap, RichTextEditorCustomEventMap {
  change: RichTextEditorChangeEvent;
}

/**
 * `<vaadin-rich-text-editor>` is a Web Component for rich text editing.
 * It provides a set of toolbar controls to apply formatting on the content,
 * which is stored and can be accessed as HTML5 or JSON string.
 *
 * ```
 * <vaadin-rich-text-editor></vaadin-rich-text-editor>
 * ```
 *
 * Vaadin Rich Text Editor focuses on the structure, not the styling of content.
 * Therefore, the semantic HTML5 tags such as <h1>, <strong> and <ul> are used,
 * and CSS usage is limited to most common cases, like horizontal text alignment.
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `disabled`   | Set to a disabled text editor | :host
 * `readonly`   | Set to a readonly text editor | :host
 * `on`         | Set to a toolbar button applied to the selected text | toolbar-button
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name                            | Description
 * -------------------------------------|----------------
 * `content`                            | The content wrapper
 * `toolbar`                            | The toolbar wrapper
 * `toolbar-group`                      | The group for toolbar controls
 * `toolbar-group-history`              | The group for histroy controls
 * `toolbar-group-emphasis`             | The group for emphasis controls
 * `toolbar-group-heading`              | The group for heading controls
 * `toolbar-group-style`                | The group for style controls
 * `toolbar-group-glyph-transformation` | The group for glyph transformation controls
 * `toolbar-group-group-list`           | The group for group list controls
 * `toolbar-group-alignment`            | The group for alignment controls
 * `toolbar-group-rich-text`            | The group for rich text controls
 * `toolbar-group-block`                | The group for preformatted block controls
 * `toolbar-group-format`               | The group for format controls
 * `toolbar-button`                     | The toolbar button (applies to all buttons)
 * `toolbar-button-pressed`             | The toolbar button in pressed state (applies to all buttons)
 * `toolbar-button-undo`                | The "undo" button
 * `toolbar-button-redo`                | The "redo" button
 * `toolbar-button-bold`                | The "bold" button
 * `toolbar-button-italic`              | The "italic" button
 * `toolbar-button-underline`           | The "underline" button
 * `toolbar-button-strike`              | The "strike-through" button
 * `toolbar-button-color`               | The "color" button
 * `toolbar-button-background`          | The "background" button
 * `toolbar-button-h1`                  | The "header 1" button
 * `toolbar-button-h2`                  | The "header 2" button
 * `toolbar-button-h3`                  | The "header 3" button
 * `toolbar-button-subscript`           | The "subscript" button
 * `toolbar-button-superscript`         | The "superscript" button
 * `toolbar-button-list-ordered`        | The "ordered list" button
 * `toolbar-button-list-bullet`         | The "bullet list" button
 * `toolbar-button-align-left`          | The "left align" button
 * `toolbar-button-align-center`        | The "center align" button
 * `toolbar-button-align-right`         | The "right align" button
 * `toolbar-button-image`               | The "image" button
 * `toolbar-button-link`                | The "link" button
 * `toolbar-button-blockquote`          | The "blockquote" button
 * `toolbar-button-code-block`          | The "code block" button
 * `toolbar-button-clean`               | The "clean formatting" button
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} html-value-changed - Fired when the `htmlValue` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class RichTextEditor extends RichTextEditorMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  addEventListener<K extends keyof RichTextEditorEventMap>(
    type: K,
    listener: (this: RichTextEditor, ev: RichTextEditorEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof RichTextEditorEventMap>(
    type: K,
    listener: (this: RichTextEditor, ev: RichTextEditorEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-rich-text-editor': RichTextEditor;
  }
}

export { RichTextEditor };
