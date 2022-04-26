import { expect } from '@esm-bundle/chai';
import {
  arrowDown,
  arrowRight,
  arrowUp,
  end,
  fixtureSync,
  focusin,
  focusout,
  home,
  mousedown,
  nextRender,
  tabKeyDown,
} from '@vaadin/testing-helpers';
import '../vaadin-message-list.js';

describe('message-list', () => {
  let messageList, messages;

  beforeEach(() => {
    const root = document.documentElement;
    root.style.setProperty('--vaadin-user-color-1', 'purple');
    root.style.setProperty('--vaadin-user-color-2', 'blue');

    messageList = fixtureSync('<vaadin-message-list></vaadin-message-list>');
    messages = [
      {
        text: 'A message in the stream of messages',
        time: '9:34 AM',
        userName: 'Joan Doe',
        userAbbr: 'JD',
        userImg: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
        userColorIndex: 1,
        theme: 'fancy',
      },
      {
        text: 'A message in the stream of messages',
        time: '9:35 AM',
        user: {
          name: 'Joan Doe',
          abbr: 'JD',
          img: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          colorIndex: 1,
        },
      },
      {
        text: 'A message in the stream of messages',
        time: '9:36 AM',
        user: {
          name: 'Joan Doe',
          abbr: 'JD',
          img: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          colorIndex: 1,
        },
      },
      {
        text: 'Call upon the times of glory',
        time: '2:34 PM',
        userName: 'Steve Mops',
        userAbbr: 'SM',
        userColorIndex: 2,
      },
    ];
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = messageList.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
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

    it('should not throw when items is undefined', () => {
      expect(() => (messageList.items = undefined)).to.not.throw();
    });

    it('message properties should be correctly set', () => {
      const firstMessage = messageList.shadowRoot.querySelector('vaadin-message');
      expect(firstMessage.time).to.be.equal(messages[0].time);
      expect(firstMessage.userName).to.be.equal(messages[0].userName);
      expect(firstMessage.userAbbr).to.be.equal(messages[0].userAbbr);
      expect(firstMessage.userImg).to.be.equal(messages[0].userImg);
      expect(firstMessage.userColorIndex).to.be.equal(messages[0].userColorIndex);
      expect(firstMessage.textContent).to.be.equal(messages[0].text);
      expect(firstMessage.theme).to.be.equal(messages[0].theme);
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
            colorIndex: 2,
          },
        },
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
            colorIndex: 2,
          },
        },
      ];
      await nextRender(messageList);
      expect(messageList.scrollTop).to.be.equal(0);
    });

    it('message list should set tab index on first item if new item list is shorter, and it does not have a item index corresponding to the previous item with tab index 0', async () => {
      const messages = messageList.shadowRoot.querySelectorAll('vaadin-message');
      const thirdMessage = messages[2];

      // click on third item to give it tabindex=0
      thirdMessage.dispatchEvent(new CustomEvent('mousedown', { composed: true, bubbles: true }));
      thirdMessage.dispatchEvent(new CustomEvent('focus', { composed: true, bubbles: true }));
      thirdMessage.dispatchEvent(new CustomEvent('mouseup', { composed: true, bubbles: true }));

      // set message list to shorter than three items, so that tabIndex=0 can't be maintained on third item
      messageList.items = [
        {
          text: 'This is a new list',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2,
          },
        },
        {
          text: 'With two items',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2,
          },
        },
      ];
      await nextRender(messageList);
      const firstMessage = messages[0];
      // Verify that the first item got the new tabIndex=0.
      expect(firstMessage.tabIndex).to.be.equal(0);
    });

    it('should preserve tabindex when increasing items count', async () => {
      const secondMessage = messageList.shadowRoot.querySelectorAll('vaadin-message')[1];
      mousedown(secondMessage);
      focusin(secondMessage);
      messageList.items = [
        ...messageList.items,
        {
          text: 'A new message arrives!',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2,
          },
        },
      ];
      await nextRender(messageList);
      const messages = messageList.shadowRoot.querySelectorAll('vaadin-message');
      messages.forEach((msg, idx) => {
        expect(msg.tabIndex).to.equal(idx === 1 ? 0 : -1);
      });
    });

    it('should preserve tabindex when decreasing items count if possible', async () => {
      const secondMessage = messageList.shadowRoot.querySelectorAll('vaadin-message')[1];
      mousedown(secondMessage);
      focusin(secondMessage);

      // set message list to two items
      messageList.items = [
        {
          text: 'This is a new list',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2,
          },
        },
        {
          text: 'With two items',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2,
          },
        },
      ];

      await nextRender(messageList);
      const messages = messageList.shadowRoot.querySelectorAll('vaadin-message');
      // Verify that the second item got the new tabIndex=0.
      expect(messages[0].tabIndex).to.be.equal(-1);
      expect(messages[1].tabIndex).to.be.equal(0);
    });
  });

  describe('focus', () => {
    let messageElements, message;

    beforeEach(async () => {
      messageList.items = messages;
      await nextRender(messageList);
      messageElements = messageList.shadowRoot.querySelectorAll('vaadin-message');
      message = messageElements[1];
    });

    it('should set focused attribute on message focusin', () => {
      focusin(message);
      expect(message.hasAttribute('focused')).to.be.true;
    });

    it('should remove focused attribute on message focusout', () => {
      focusin(message);
      focusout(message);
      expect(message.hasAttribute('focused')).to.be.false;
    });

    it('should set focus-ring attribute on message focusin after Tab', () => {
      tabKeyDown(document.body);
      focusin(message);
      expect(message.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set the focus-ring attribute on message mousedown', () => {
      tabKeyDown(document.body);
      mousedown(document.body);
      focusin(message);
      expect(message.hasAttribute('focus-ring')).to.be.false;
    });

    it('should set focus-ring attribute on message focusin after Tab', () => {
      tabKeyDown(document.body);
      focusin(message);
      expect(message.hasAttribute('focus-ring')).to.be.true;
    });

    it('should update tabindex for message elements on focusin', () => {
      focusin(message);
      messageElements.forEach((msg, idx) => {
        expect(msg.tabIndex).to.equal(idx === 1 ? 0 : -1);
      });
    });
  });

  describe('keyboard navigation', () => {
    let messageElements;

    beforeEach(async () => {
      messageList.items = messages;
      await nextRender(messageList);
      messageElements = messageList.shadowRoot.querySelectorAll('vaadin-message');
    });

    it('should set tabindex on the next message on "arrow-down" keydown', () => {
      arrowDown(messageElements[0]);
      messageElements.forEach((msg, idx) => {
        expect(msg.tabIndex).to.equal(idx === 1 ? 0 : -1);
      });
    });

    it('should move focus to the next message on "arrow-down" keydown', () => {
      arrowDown(messageElements[0]);
      expect(messageElements[0].hasAttribute('focused')).to.be.false;
      expect(messageElements[1].hasAttribute('focused')).to.be.true;
    });

    it('should focus first message on last message "arrow-down" keydown', () => {
      arrowDown(messageElements[3]);
      expect(messageElements[3].hasAttribute('focused')).to.be.false;
      expect(messageElements[0].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to the previous message on "arrow-up" keydown', () => {
      arrowUp(messageElements[1]);
      expect(messageElements[1].hasAttribute('focused')).to.be.false;
      expect(messageElements[0].hasAttribute('focused')).to.be.true;
    });

    it('should focus last message on first message "arrow-down" keydown', () => {
      arrowUp(messageElements[0]);
      expect(messageElements[0].hasAttribute('focused')).to.be.false;
      expect(messageElements[3].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to the first message on "home" keydown', () => {
      home(messageElements[2]);
      expect(messageElements[2].hasAttribute('focused')).to.be.false;
      expect(messageElements[0].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to the last panel on "end" keydown', () => {
      end(messageElements[1]);
      expect(messageElements[1].hasAttribute('focused')).to.be.false;
      expect(messageElements[3].hasAttribute('focused')).to.be.true;
    });

    it('should set focus-ring attribute when moving focus using keyboard', () => {
      expect(messageElements[1].hasAttribute('focus-ring')).to.be.false;
      arrowDown(messageElements[0]);
      expect(messageElements[1].hasAttribute('focus-ring')).to.be.true;
    });

    it('should ignore keydown events when Ctrl modifier key is pressed', () => {
      arrowDown(messageElements[1]);
      arrowDown(messageElements[2], ['ctrl']);
      expect(messageElements[3].hasAttribute('focused')).to.be.false;
      expect(messageElements[2].hasAttribute('focused')).to.be.true;
    });

    it('should not change focus when unrelated key is pressed', () => {
      arrowDown(messageElements[0]);
      arrowRight(messageElements[1]);
      expect(messageElements[1].hasAttribute('focused')).to.be.true;
    });
  });
});
