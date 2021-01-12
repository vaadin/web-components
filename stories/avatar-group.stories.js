import { html } from 'lit-html';
import '../packages/vaadin-avatar/vaadin-avatar-group.js';

export default {
  title: 'Components/Avatar Group',
  argTypes: {
    maxItemsVisible: { control: 'number' },
    theme: {
      control: {
        type: 'inline-radio',
        options: ['(not set)', 'xlarge', 'large', 'small', 'xsmall']
      }
    }
  }
};

const items = [
  { name: 'Yuriy Yevstihnyeyev' },
  { abbr: 'SK' },
  { name: 'Leif Åstrand' },
  { name: 'Jens Jansson' },
  { name: 'Pekka Maanpää' }
];

const AvatarGroup = ({ maxItemsVisible, theme }) => {
  return html`
    <vaadin-avatar-group .maxItemsVisible="${maxItemsVisible}" theme="${theme}" .items="${items}"></vaadin-avatar-group>
  `;
};

export const Basic = (args) => AvatarGroup(args);
