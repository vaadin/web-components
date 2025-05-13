import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
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
  const messages = [
    {
      text: 'This is a **bold text** in Markdown',
      time: '10:00 AM',
      userName: 'Markdown User',
      userAbbr: 'MU',
    },
  ];

  beforeEach(() => {
    messageList = fixtureSync('<vaadin-message-list></vaadin-message-list>');
  });

  it('should not render incorrect content during import', async () => {
    messageList.markdown = true;
    messageList.items = messages;

    // Expect the markdown to not exist in DOM as such
    expect(messageList.textContent).to.not.include('**bold text**');

    // Expect the markdown to be rendered as HTML eventually
    await until(() => messageList.querySelector('vaadin-message strong')?.textContent === 'bold text');
  });
});
