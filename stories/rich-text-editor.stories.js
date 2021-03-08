import { html } from 'lit-html';
import '../packages/vaadin-rich-text-editor/vaadin-rich-text-editor.js';

export default {
  title: 'Components/<vaadin-rich-text-editor>',
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' }
  }
};

const RichTextEditor = ({ disabled = false, readonly = false }) => {
  return html`<vaadin-rich-text-editor .disabled="${disabled}" .readonly="${readonly}"></vaadin-rich-text-editor>`;
};

export const Basic = (args) => RichTextEditor(args);
