import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-message-list.js';

describe('message-list-markdown', () => {
  let messageList;
  const messages = [
    {
      text: 'This is a **bold text** in Markdown',
      time: '10:00 AM',
      userName: 'Markdown User',
      userAbbr: 'MU',
    },
  ];

  beforeEach(async () => {
    messageList = fixtureSync('<vaadin-message-list markdown></vaadin-message-list>');
    messageList.items = messages;
    await nextUpdate(messageList);
  });

  it('should render the message items as markdown', () => {
    const strongElement = messageList.querySelector('vaadin-message strong');
    expect(strongElement).to.exist;
    expect(strongElement.textContent).to.equal('bold text');
  });

  it('should toggle markdown rendering when property changes', async () => {
    // First check with markdown enabled
    expect(messageList.querySelector('vaadin-message strong')).to.exist;

    // Disable markdown
    messageList.markdown = false;
    await nextUpdate(messageList);

    // Verify markdown is disabled on messages
    expect(messageList.querySelector('vaadin-message strong')).to.not.exist;

    // Re-enable markdown
    messageList.markdown = true;
    await nextUpdate(messageList);

    // Verify markdown is re-enabled
    expect(messageList.querySelector('vaadin-message strong')).to.exist;
  });
});
