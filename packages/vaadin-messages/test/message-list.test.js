import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import '../vaadin-message-list.js';

function nextRender(target) {
  return new Promise((resolve) => {
    afterNextRender(target, () => {
      resolve();
    });
  });
}

describe('message-list', () => {
  let messageList, messages;

  beforeEach(() => {
    let root = document.documentElement;
    root.style.setProperty('--vaadin-user-color-1', 'purple');
    root.style.setProperty('--vaadin-user-color-2', 'blue');

    messageList = fixtureSync('<vaadin-message-list></vaadin-message-list>');
    messages = [
      {
        text: 'A message in the stream of messages',
        time: '9:34 AM',
        userName: 'Joan Doe',
        userAbbr: 'JD',
        userImg: '/test/visual/avatars/avatar.jpg',
        userColorIndex: 1
      },
      {
        text: 'A message in the stream of messages',
        time: '9:35 AM',
        user: {
          name: 'Joan Doe',
          abbr: 'JD',
          img: '/test/visual/avatars/avatar.jpg',
          colorIndex: 1
        }
      },
      {
        text: 'A message in the stream of messages',
        time: '9:36 AM',
        user: {
          name: 'Joan Doe',
          abbr: 'JD',
          img: '/test/visual/avatars/avatar.jpg',
          colorIndex: 1
        }
      },
      {
        text: 'Call upon the times of glory',
        time: '2:34 PM',
        userName: 'Steve Mops',
        userAbbr: 'SM',
        userColorIndex: 2
      }
    ];
  });

  it('should have a valid version number', () => {
    expect(messageList.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
  });

  it('message list should be initially empty', () => {
    expect(messageList.items).to.be.empty;
  });

  describe('items property', () => {
    beforeEach(async () => {
      messageList.items = messages;
      await nextRender(messageList);
    });

    it('message list should have two messages', () => {
      const items = messageList.shadowRoot.querySelectorAll('vaadin-message');
      expect(items.length).to.equal(4);
    });

    it('message properties should be correctly set', () => {
      const firstMessage = messageList.shadowRoot.querySelectorAll('vaadin-message')[0];
      expect(firstMessage.time).to.be.equal(messages[0].time);
      expect(firstMessage.userName).to.be.equal(messages[0].userName);
      expect(firstMessage.userAbbr).to.be.equal(messages[0].userAbbr);
      expect(firstMessage.userImg).to.be.equal(messages[0].userImg);
      expect(firstMessage.userColorIndex).to.be.equal(messages[0].userColorIndex);
      expect(firstMessage.textContent).to.be.equal(messages[0].text);
    });

    it('message list should scroll when height is less than content', () => {
      messageList.style.height = '100px';
      expect(messageList.scrollTop).to.be.equal(0);
      messageList.scrollBy(0, 1000);
      expect(messageList.scrollTop).to.be.at.least(1);
    });

    it('message list should scroll to bottom on new messages', async () => {
      messageList.style.height = '100px';
      messageList.scrollBy(0, 1000);
      const scrollTopBeforeMessage = messageList.scrollTop;
      messageList.items = [
        ...messageList.items,
        {
          text: 'A new message arrives!',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2
          }
        }
      ];
      await nextRender(messageList);
      expect(messageList.scrollTop).to.be.at.least(scrollTopBeforeMessage + 1);
    });

    it('message list should not scroll if not at the bottom', async () => {
      messageList.style.height = '100px';
      messageList.items = [
        ...messageList.items,
        {
          text: 'A new message arrives!',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2
          }
        }
      ];
      await nextRender(messageList);
      expect(messageList.scrollTop).to.be.equal(0);
    });
  });
});
