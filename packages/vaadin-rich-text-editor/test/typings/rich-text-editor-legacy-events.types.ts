import '../../vaadin-rich-text-editor.js';

import { RichTextEditorHtmlValueChanged, RichTextEditorValueChanged } from '../../vaadin-rich-text-editor.js';

const customField = document.createElement('vaadin-rich-text-editor');

const assertType = <TExpected>(actual: TExpected) => actual;

customField.addEventListener('html-value-changed', (event) => {
  assertType<RichTextEditorHtmlValueChanged>(event);
});

customField.addEventListener('value-changed', (event) => {
  assertType<RichTextEditorValueChanged>(event);
});
