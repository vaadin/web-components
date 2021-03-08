import { html } from 'lit-html';
import '../packages/vaadin-notification/vaadin-notification.js';

export default {
  title: 'Components/<vaadin-notification>',
  argTypes: {
    position: {
      control: {
        type: 'select',
        options: [
          'bottom-start',
          'bottom-center',
          'bottom-end',
          'bottom-stretch',
          'middle',
          'top-start',
          'top-center',
          'top-end',
          'top-stretch'
        ]
      }
    }
  }
};

const notificationRenderer = (root) => {
  root.textContent = 'Notification content';
};

const Notification = ({ position }) => {
  return html`
    <vaadin-notification
      .position="${position}"
      .renderer="${notificationRenderer}"
      opened
      duration="-1"
    ></vaadin-notification>
  `;
};

export const Basic = (args) => Notification(args);

Basic.args = {
  position: 'bottom-start'
};
