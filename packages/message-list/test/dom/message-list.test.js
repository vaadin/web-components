import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-message-list.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-message-list', () => {
  let list;

  beforeEach(() => {
    resetUniqueId();
    list = fixtureSync('<vaadin-message-list></vaadin-message-list>');
  });

  it('default', async () => {
    await expect(list).dom.to.equalSnapshot();
  });

  it('items', async () => {
    list.items = [
      { text: 'Hi folks!', userName: 'Jane Doe' },
      { text: 'Good morning!', userName: 'Lina Roy' },
    ];
    await nextFrame();
    await expect(list).dom.to.equalSnapshot();
  });

  it('theme', async () => {
    list.items = [{ text: 'Partial service outage.', userName: 'Admin', theme: 'danger' }];
    await nextFrame();
    await expect(list).dom.to.equalSnapshot();
  });

  it('className', async () => {
    list.items = [{ text: 'Where to start', userName: 'Admin', className: 'pinned' }];
    await nextFrame();
    await expect(list).dom.to.equalSnapshot();
  });

  describe('typing indicator', () => {
    before(() => {
      Object.defineProperty(navigator, 'language', { configurable: true, value: 'en-US' });
    });

    after(() => {
      delete navigator.language;
    });

    it('default', async () => {
      list.items = [{ text: 'Hi folks!', userName: 'Jane Doe' }];
      list._usersTyping = [
        { name: 'Lina Roy', abbr: 'LR' },
        { name: 'Tomi Virkki', abbr: 'TV' },
      ];
      await nextFrame();
      await expect(list).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(list).shadowDom.to.equalSnapshot();
    });
  });
});
