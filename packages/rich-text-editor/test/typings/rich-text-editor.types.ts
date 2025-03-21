import '../../vaadin-rich-text-editor.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type {
  RichTextEditor,
  RichTextEditorChangeEvent,
  RichTextEditorHtmlValueChangedEvent,
  RichTextEditorI18n,
  RichTextEditorValueChangedEvent,
} from '../../vaadin-rich-text-editor.js';

const richTextEditor = document.createElement('vaadin-rich-text-editor');

const assertType = <TExpected>(actual: TExpected) => actual;

// Mixins
assertType<I18nMixinClass<RichTextEditorI18n>>(richTextEditor);

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

// I18n
assertType<RichTextEditorI18n>({});
assertType<RichTextEditorI18n>({ undo: 'Undo' });
