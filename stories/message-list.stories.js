import { html } from 'lit-html';
import '../packages/vaadin-messages/vaadin-message.js';

export default {
  title: 'Components/Message List'
};

const MessageList = () => {
  const items = [
    {
      text: 'Hello list',
      time: 'yesterday',
      userName: 'Matt Mambo',
      userAbbr: 'MM',
      userColorIndex: 1
    },
    {
      text: 'Another message',
      time: 'right now',
      userName: 'Linsey Listy',
      userAbbr: 'LL',
      userColorIndex: 2,
      userImg: 'https://avataaars.io/?avatarStyle=Transparent'
    }
  ];

  return html`<vaadin-message-list .items="${items}"></vaadin-message-list>`;
};

export const Basic = (args) => MessageList(args);
