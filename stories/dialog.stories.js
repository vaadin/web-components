import { html } from 'lit-html';
import '../packages/vaadin-dialog/vaadin-dialog.js';

export default {
  title: 'Components/<vaadin-dialog>',
  argTypes: {
    draggable: { control: 'boolean' },
    resizable: { control: 'boolean' }
  }
};

const dialogRenderer = (root) => {
  root.textContent = 'Dialog content';
};

const Dialog = ({ draggable, resizable }) => {
  return html`
    <vaadin-dialog
      .draggable="${draggable}"
      .resizable="${resizable}"
      .renderer="${dialogRenderer}"
      opened
      no-close-on-esc
      no-close-on-outside-click
    ></vaadin-dialog>
  `;
};

export const Basic = (args) => Dialog(args);
