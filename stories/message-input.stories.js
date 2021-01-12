import { html } from 'lit-html';
import '../packages/vaadin-messages/vaadin-message-input.js';

export default {
  title: 'Components/Message Input',
  argTypes: {
    disabled: { control: 'boolean' }
  }
};

const MessageInput = ({ disabled = false }) => {
  return html`<vaadin-message-input .disabled="${disabled}"></vaadin-message-input>`;
};

export const Basic = (args) => MessageInput(args);
