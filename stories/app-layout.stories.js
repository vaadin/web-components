import { html } from 'lit-html';
import '../packages/vaadin-app-layout/vaadin-app-layout.js';
import '../packages/vaadin-app-layout/vaadin-drawer-toggle.js';

export default {
  title: 'Components/<vaadin-app-layout>',
  argTypes: {
    primarySection: {
      control: {
        type: 'inline-radio',
        options: ['navbar', 'drawer']
      }
    }
  }
};

const AppLayout = ({ primarySection }) => {
  return html`
    <vaadin-app-layout .primarySection="${primarySection}">
      <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
      <h2 slot="navbar">App Name</h2>
      <section slot="drawer">Drawer content</section>
      <main>Page content</main>
    </vaadin-app-layout>
  `;
};

export const Basic = (args) => AppLayout(args);

Basic.args = {
  primarySection: 'navbar'
};
