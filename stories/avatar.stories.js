import { html } from 'lit-html';
import '../packages/vaadin-avatar/vaadin-avatar.js';

export default {
  title: 'Collaboration/<vaadin-avatar>',
  argTypes: {
    name: { control: 'text' },
    abbr: { control: 'text' },
    img: { control: 'text' },
    theme: {
      control: {
        type: 'inline-radio',
        options: ['(not set)', 'xlarge', 'large', 'small', 'xsmall']
      }
    }
  }
};

const Avatar = ({ name, abbr, img, theme }) => {
  return html`<vaadin-avatar .name="${name}" .abbr="${abbr}" .img="${img}" theme="${theme}"></vaadin-avatar>`;
};

export const Basic = (args) => Avatar(args);
