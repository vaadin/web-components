import { html } from 'lit-html';
import '../packages/vaadin-login/vaadin-login-overlay.js';

export default {
  title: 'Components/Login Overlay',
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' }
  }
};

const LoginOverlay = ({ title, description }) => {
  return html`<vaadin-login-overlay .title="${title}" .description="${description}" opened></vaadin-login-overlay>`;
};

export const Basic = (args) => LoginOverlay(args);

Basic.args = {
  title: 'App name',
  description: 'Application description'
};
