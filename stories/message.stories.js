import { html } from 'lit-html';
import '../packages/vaadin-messages/vaadin-message-list.js';

export default {
  title: 'Components/Message',
  argTypes: {
    text: { control: 'text' },
    time: { control: 'text' },
    userColorIndex: { control: 'number' },
    userAbbr: { control: 'text' },
    userImg: { control: 'text' },
    userName: { control: 'text' }
  }
};

const Message = ({ text, time, userColorIndex, userAbbr, userImg, userName }) => {
  return html`
    <vaadin-message
      .time="${time}"
      .userColorIndex="${userColorIndex}"
      .userName="${userName}"
      .userImg="${userImg}"
      .userAbbr="${userAbbr}"
      >${text}</vaadin-message
    >
  `;
};

export const Basic = (args) => Message(args);

Basic.args = {
  text: 'There is no real ending. It is just the place where you stop the story.',
  time: '2021-01-28 10:43',
  userColorIndex: 1,
  userAbbr: 'LL',
  userImg: 'https://avataaars.io/?avatarStyle=Transparent',
  userName: 'Laura Arnaud'
};
