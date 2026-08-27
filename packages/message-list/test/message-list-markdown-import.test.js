import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-message-list.js';

async function until(predicate) {
  while (!predicate()) {
    await new Promise((r) => {
      setTimeout(r, 10);
    });
  }
  return predicate();
}

describe('message-list-markdown dynamic import', () => {
  let messageList;
  const messages = Array.from({ length: 20 }, (_, i) => ({
    text: `Message ${i} with **bold text** in Markdown`,
    time: '10:00 AM',
    userName: 'Markdown User',
    userAbbr: 'MU',
  }));

  beforeEach(() => {
    messageList = fixtureSync('<vaadin-message-list style="height: 200px"></vaadin-message-list>');
  });

  it('should render the markdown and scroll to the last message after the import', async () => {
    messageList.markdown = true;
    messageList.items = messages;

    // Expect the markdown to not exist in DOM as such
    expect(messageList.textContent).to.not.include('**bold text**');

    const message = messageList.querySelector('vaadin-message');
    expect(getComputedStyle(message).visibility).to.equal('hidden');

    // Expect the markdown to be rendered as HTML eventually
    await until(() => messageList.querySelectorAll('vaadin-message strong').length === messages.length);
    await nextFrame();

    expect(getComputedStyle(message).visibility).to.equal('visible');
    expect(messageList.scrollTop).to.be.closeTo(messageList.scrollHeight - messageList.clientHeight, 1);
  });
});
