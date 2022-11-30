/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
