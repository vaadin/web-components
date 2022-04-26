import '../../vaadin-rich-text-editor.js';
import {
  RichTextEditor,
  RichTextEditorChangeEvent,
  RichTextEditorHtmlValueChangedEvent,
  RichTextEditorValueChangedEvent,
} from '../../vaadin-rich-text-editor.js';

const richTextEditor = document.createElement('vaadin-rich-text-editor');

const assertType = <TExpected>(actual: TExpected) => actual;

// Events
richTextEditor.addEventListener('change', (event) => {
  assertType<RichTextEditorChangeEvent>(event);
  assertType<RichTextEditor>(event.target);
});

richTextEditor.addEventListener('html-value-changed', (event) => {
  assertType<RichTextEditorHtmlValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

richTextEditor.addEventListener('value-changed', (event) => {
  assertType<RichTextEditorValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
