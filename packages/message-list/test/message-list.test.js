import { expect } from '@esm-bundle/chai';
import { arrowDown, arrowRight, arrowUp, end, fixtureSync, home, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-message-list.js';

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
        userImg: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
        userColorIndex: 1,
        theme: 'fancy'
      },
      {
        text: 'A message in the stream of messages',
        time: '9:35 AM',
        user: {
          name: 'Joan Doe',
          abbr: 'JD',
          img: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
          colorIndex: 1
        }
      },
      {
        text: 'A message in the stream of messages',
        time: '9:36 AM',
        user: {
          name: 'Joan Doe',
          abbr: 'JD',
          img: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
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
            colorIndex: 2
          }
        },
        {
          text: 'With two items',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2
          }
        }
      ];
      await nextRender(messageList);
      const firstMessage = messages[0];
      // Verify that the first item got the new tabIndex=0.
      expect(firstMessage.tabIndex).to.be.equal(0);
    });

    it('should preserve index of message with tabindex=0 when list grows', async () => {
      const secondMessage = messageList.shadowRoot.querySelectorAll('vaadin-message')[1];
      secondMessage.dispatchEvent(new CustomEvent('mousedown', { composed: true, bubbles: true }));
      secondMessage.dispatchEvent(new CustomEvent('focus', { composed: true, bubbles: true }));
      secondMessage.dispatchEvent(new CustomEvent('mouseup', { composed: true, bubbles: true }));
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
      const messages = messageList.shadowRoot.querySelectorAll('vaadin-message');
      expect(messages[0].tabIndex).to.be.equal(-1);
      expect(messages[1].tabIndex).to.be.equal(0);
      expect(messages[2].tabIndex).to.be.equal(-1);
      expect(messages[3].tabIndex).to.be.equal(-1);
      expect(messages[4].tabIndex).to.be.equal(-1);
    });

    it('should preserve index of message with tabindex=0 when list is made shorter, but still have enough messages to preserve it', async () => {
      const secondMessage = messageList.shadowRoot.querySelectorAll('vaadin-message')[1];
      // click on second item to give it tabindex=0
      secondMessage.dispatchEvent(new CustomEvent('mousedown', { composed: true, bubbles: true }));
      secondMessage.dispatchEvent(new CustomEvent('focus', { composed: true, bubbles: true }));
      secondMessage.dispatchEvent(new CustomEvent('mouseup', { composed: true, bubbles: true }));

      // set message list to two items
      messageList.items = [
        {
          text: 'This is a new list',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2
          }
        },
        {
          text: 'With two items',
          time: '2:35 PM',
          user: {
            name: 'Steve Mops',
            abbr: 'SM',
            colorIndex: 2
          }
        }
      ];

      await nextRender(messageList);
      const messages = messageList.shadowRoot.querySelectorAll('vaadin-message');
      // Verify that the second item got the new tabIndex=0.
      expect(messages[0].tabIndex).to.be.equal(-1);
      expect(messages[1].tabIndex).to.be.equal(0);
    });
  });

  describe('mouse navigation', () => {
    let messageElements;

    beforeEach(async () => {
      messageList.items = messages;
      await nextRender(messageList);
      messageElements = messageList.shadowRoot.querySelectorAll('vaadin-message');
    });

    it('click message to give it focus', () => {
      messageElements[1].dispatchEvent(new CustomEvent('mousedown', { composed: true, bubbles: true }));
      messageElements[1].dispatchEvent(new CustomEvent('focus', { composed: true, bubbles: true }));
      messageElements[1].dispatchEvent(new CustomEvent('mouseup', { composed: true, bubbles: true }));

      expect(messageElements[1].hasAttribute('focused')).to.be.true;
      expect(messageElements[1].tabIndex).to.be.equal(0);
    });

    it('click message should not add focus ring', () => {
      messageElements[1].dispatchEvent(new CustomEvent('mousedown', { composed: true, bubbles: true }));
      messageElements[1].dispatchEvent(new CustomEvent('focus', { composed: true, bubbles: true }));
      messageElements[1].dispatchEvent(new CustomEvent('mouseup', { composed: true, bubbles: true }));

      expect(messageElements[1].hasAttribute('focus-ring')).to.be.false;
    });

    it('click message moves tabindex=0 to the newly selected item', () => {
      messageElements[1].dispatchEvent(new CustomEvent('mousedown', { composed: true, bubbles: true }));
      messageElements[1].dispatchEvent(new CustomEvent('focus', { composed: true, bubbles: true }));
      messageElements[1].dispatchEvent(new CustomEvent('mouseup', { composed: true, bubbles: true }));
      messageElements.forEach((aMessage) => {
        aMessage === messageElements[1]
          ? expect(aMessage.tabIndex).to.be.equal(0)
          : expect(aMessage.tabIndex).to.be.equal(-1);
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

    it('no focus before interaction', () => {
      messageElements.forEach((aMessage) => {
        expect(aMessage.hasAttribute('focused')).to.be.false;
      });
    });

    it('down arrow should select the next message', () => {
      arrowDown(messageElements[0]);
      expect(messageElements[0].hasAttribute('focused')).to.be.false;
      expect(messageElements[1].hasAttribute('focused')).to.be.true;
    });

    it('down arrow on last message should select first message', () => {
      arrowDown(messageElements[3]);
      expect(messageElements[3].hasAttribute('focused')).to.be.false;
      expect(messageElements[0].hasAttribute('focused')).to.be.true;
    });

    it('down arrow moves tabindex=0 to the newly selected item', () => {
      arrowDown(messageElements[0]);
      messageElements.forEach((aMessage) => {
        aMessage === messageElements[1]
          ? expect(aMessage.tabIndex).to.be.equal(0)
          : expect(aMessage.tabIndex).to.be.equal(-1);
      });
    });

    it('up arrow should select the previous message', () => {
      arrowUp(messageElements[1]);
      expect(messageElements[1].hasAttribute('focused')).to.be.false;
      expect(messageElements[0].hasAttribute('focused')).to.be.true;
    });

    it('up arrow on first message should select last message', () => {
      arrowUp(messageElements[0]);
      expect(messageElements[0].hasAttribute('focused')).to.be.false;
      expect(messageElements[3].hasAttribute('focused')).to.be.true;
    });

    it('home on any message should select first message', () => {
      home(messageElements[2]);
      expect(messageElements[2].hasAttribute('focused')).to.be.false;
      expect(messageElements[0].hasAttribute('focused')).to.be.true;
    });

    it('end on any message should select last message', () => {
      end(messageElements[1]);
      expect(messageElements[1].hasAttribute('focused')).to.be.false;
      expect(messageElements[3].hasAttribute('focused')).to.be.true;
    });

    it('keyboard navigation should add focus-ring', () => {
      expect(messageElements[1].hasAttribute('focus-ring')).to.be.false;
      arrowDown(messageElements[0]);
      expect(messageElements[1].hasAttribute('focus-ring')).to.be.true;
    });

    it('should remove focus-ring and focused when component is blurred', () => {
      arrowDown(messageElements[0]);
      expect(messageElements[1].hasAttribute('focus-ring')).to.be.true;
      expect(messageElements[1].hasAttribute('focused')).to.be.true;
      messageElements[1].dispatchEvent(new CustomEvent('blur', { composed: true, bubbles: true }));
      expect(messageElements[1].hasAttribute('focus-ring')).to.be.false;
      expect(messageElements[1].hasAttribute('focused')).to.be.false;
    });

    it('holding down control while pressing keys should not do anything', () => {
      arrowDown(messageElements[1]);
      arrowDown(messageElements[2], ['ctrl']);
      expect(messageElements[3].hasAttribute('focused')).to.be.false;
      expect(messageElements[2].hasAttribute('focused')).to.be.true;
    });

    it('random unhandled key press should not affect focus', () => {
      arrowDown(messageElements[0]);
      arrowRight(messageElements[1]);
      expect(messageElements[1].hasAttribute('focused')).to.be.true;
    });
  });
});
