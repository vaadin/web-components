/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { RichTextEditor } from '@vaadin/rich-text-editor/src/vaadin-rich-text-editor.js';

/**
 * @deprecated Import `RichTextEditor` from `@vaadin/rich-text-editor` instead.
 */
export const RichTextEditorElement = RichTextEditor;

export * from '@vaadin/rich-text-editor/src/vaadin-rich-text-editor.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-rich-text-editor" is deprecated. Use "@vaadin/rich-text-editor" instead.',
);
