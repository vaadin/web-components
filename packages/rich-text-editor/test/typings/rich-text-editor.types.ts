import '../../vaadin-rich-text-editor.js';

import { RichTextEditorHtmlValueChangedEvent, RichTextEditorValueChangedEvent } from '../../vaadin-rich-text-editor.js';

const customField = document.createElement('vaadin-rich-text-editor');

const assertType = <TExpected>(actual: TExpected) => actual;

customField.addEventListener('html-value-changed', (event) => {
  assertType<RichTextEditorHtmlValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

customField.addEventListener('value-changed', (event) => {
  assertType<RichTextEditorValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
