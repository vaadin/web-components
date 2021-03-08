import { html } from 'lit-html';
import '../packages/vaadin-confirm-dialog/vaadin-confirm-dialog.js';

export default {
  title: 'Components/<vaadin-confirm-dialog>',
  argTypes: {
    message: { control: 'text' },
    cancel: { control: 'boolean' },
    reject: { control: 'boolean' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
    rejectText: { control: 'text' }
  }
};

const ConfirmDialog = ({ message, cancel, reject, confirmText, cancelText, rejectText }) => {
  return html`
    <vaadin-confirm-dialog
      .message="${message}"
      .cancel="${cancel}"
      .reject="${reject}"
      .confirmText="${confirmText}"
      .cancelText="${cancelText}"
      .rejectText="${rejectText}"
      opened
      no-close-on-esc
    ></vaadin-confirm-dialog>
  `;
};

export const Basic = (args) => ConfirmDialog(args);

Basic.args = {
  message: 'This action can not be undone. Are you sure?',
  cancel: true,
  reject: true,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  rejectText: 'Reject'
};
