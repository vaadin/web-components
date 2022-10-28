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

    it('should render vaadin-message element for each item', () => {
      const items = messageList.querySelectorAll('vaadin-message');
      expect(items.length).to.equal(4);
    });

    it('should not throw when items is undefined', () => {
      expect(() => {
        messageList.items = undefined;
      }).to.not.throw();
    });

    it('message properties should be correctly set', () => {
      const firstMessage = messageList.querySelector('vaadin-message');
      expect(firstMessage.time).to.be.equal(messages[0].time);
      expect(firstMessage.userName).to.be.equal(messages[0].userName);
      expect(firstMessage.userAbbr).to.be.equal(messages[0].userAbbr);
      expect(firstMessage.userImg).to.be.equal(messages[0].userImg);
      expect(firstMessage.userColorIndex).to.be.equal(messages[0].userColorIndex);
      expect(firstMessage.textContent).to.be.equal(messages[0].text);
      expect(firstMessage.theme).to.be.equal(messages[0].theme);
    });

    describe('adding / removing', () => {
      it('should remove vaadin-message elements for removed items', async () => {
        messageList.items = [messages[1], messages[2]];
        await nextRender();
        const items = messageList.querySelectorAll('vaadin-message');
        expect(items.length).to.equal(2);
      });

      it('should append vaadin-message elements for items added at the end', async () => {
        messageList.items = [messages[1], messages[2], { userAbbr: 'SK', text: 'Hi' }];
        await nextRender();
        const items = messageList.querySelectorAll('vaadin-message');
        expect(items.length).to.equal(3);
        expect(items[2].textContent).to.equal('Hi');
      });

      it('should insert vaadin-message elements for items added in the middle', async () => {
        messageList.items = [messages[1], { userAbbr: 'SK', text: 'Hi' }, messages[2]];
        await nextRender();
        const items = messageList.querySelectorAll('vaadin-message');
        expect(items.length).to.equal(3);
        expect(items[1].textContent).to.equal('Hi');
      });

      it('should reuse existing vaadin-message element when updating items', async () => {
        const firstMessage = messageList.querySelector('vaadin-message');
        messageList.items = [messages[1], messages[2]];
        await nextRender();
        const items = messageList.querySelectorAll('vaadin-message');
        expect(items.length).to.equal(2);
        expect(items[0]).to.eql(firstMessage);
        expect(items[1]).to.not.eql(firstMessage);
      });
    });

    describe('scroll', () => {
      it('should scroll when height is less than content', () => {
        messageList.style.height = '100px';
        expect(messageList.scrollTop).to.be.equal(0);
        messageList.scrollBy(0, 1000);
        expect(messageList.scrollTop).to.be.at.least(1);
      });

      it('should scroll to bottom on adding new messages', async () => {
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

      it('should not scroll if not at the bottom', async () => {
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
    });

    describe('tabindex', () => {
      it('should set tabindex 0 on first message after removing the one that had it previously', async () => {
        const messages = messageList.querySelectorAll('vaadin-message');
        const thirdMessage = messages[2];

        // Click on third item to give it tabindex=0
        thirdMessage.dispatchEvent(new CustomEvent('mousedown', { composed: true, bubbles: true }));
        thirdMessage.dispatchEvent(new CustomEvent('focus', { composed: true, bubbles: true }));
        thirdMessage.dispatchEvent(new CustomEvent('mouseup', { composed: true, bubbles: true }));

        // Set message list to shorter than three items, so that tabIndex=0 can't be maintained on third item
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

      it('should preserve tabindex when adding new messages', async () => {
        const secondMessage = messageList.querySelectorAll('vaadin-message')[1];
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
        const messages = messageList.querySelectorAll('vaadin-message');
        messages.forEach((msg, idx) => {
          expect(msg.tabIndex).to.equal(idx === 1 ? 0 : -1);
        });
      });

      it('should preserve tabindex when removing messages if possible', async () => {
        const secondMessage = messageList.querySelectorAll('vaadin-message')[1];
        mousedown(secondMessage);
        focusin(secondMessage);

        // Set message list to two items
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
        const messages = messageList.querySelectorAll('vaadin-message');
        // Verify that the second item got the new tabIndex=0.
        expect(messages[0].tabIndex).to.be.equal(-1);
        expect(messages[1].tabIndex).to.be.equal(0);
      });
    });
  });

  describe('focus', () => {
    let messageElements, message;

    beforeEach(async () => {
      messageList.items = messages;
      await nextRender(messageList);
      messageElements = messageList.querySelectorAll('vaadin-message');
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
      messageElements = messageList.querySelectorAll('vaadin-message');
    });

    it('should set tabindex on the next message on "arrow-down" keydown', () => {
      messageElements[0].focus();
      arrowDown(messageElements[0]);
      messageElements.forEach((msg, idx) => {
        expect(msg.tabIndex).to.equal(idx === 1 ? 0 : -1);
      });
    });

    it('should move focus to the next message on "arrow-down" keydown', () => {
      messageElements[0].focus();
      arrowDown(messageElements[0]);
      expect(messageElements[0].hasAttribute('focused')).to.be.false;
      expect(messageElements[1].hasAttribute('focused')).to.be.true;
    });

    it('should focus first message on last message "arrow-down" keydown', () => {
      messageElements[3].focus();
      arrowDown(messageElements[3]);
      expect(messageElements[3].hasAttribute('focused')).to.be.false;
      expect(messageElements[0].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to the previous message on "arrow-up" keydown', () => {
      messageElements[1].focus();
      arrowUp(messageElements[1]);
      expect(messageElements[1].hasAttribute('focused')).to.be.false;
      expect(messageElements[0].hasAttribute('focused')).to.be.true;
    });

    it('should focus last message on first message "arrow-down" keydown', () => {
      messageElements[0].focus();
      arrowUp(messageElements[0]);
      expect(messageElements[0].hasAttribute('focused')).to.be.false;
      expect(messageElements[3].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to the first message on "home" keydown', () => {
      messageElements[2].focus();
      home(messageElements[2]);
      expect(messageElements[2].hasAttribute('focused')).to.be.false;
      expect(messageElements[0].hasAttribute('focused')).to.be.true;
    });

    it('should move focus to the last message on "end" keydown', () => {
      messageElements[1].focus();
      end(messageElements[1]);
      expect(messageElements[1].hasAttribute('focused')).to.be.false;
      expect(messageElements[3].hasAttribute('focused')).to.be.true;
    });

    it('should set focus-ring attribute when moving focus using keyboard', () => {
      expect(messageElements[1].hasAttribute('focus-ring')).to.be.false;
      messageElements[0].focus();
      arrowDown(messageElements[0]);
      expect(messageElements[1].hasAttribute('focus-ring')).to.be.true;
    });

    it('should ignore keydown events when Ctrl modifier key is pressed', () => {
      messageElements[1].focus();
      arrowDown(messageElements[1]);
      arrowDown(messageElements[2], ['ctrl']);
      expect(messageElements[3].hasAttribute('focused')).to.be.false;
      expect(messageElements[2].hasAttribute('focused')).to.be.true;
    });

    it('should not change focus when unrelated key is pressed', () => {
      messageElements[0].focus();
      arrowDown(messageElements[0]);
      arrowRight(messageElements[1]);
      expect(messageElements[1].hasAttribute('focused')).to.be.true;
    });
  });
});
