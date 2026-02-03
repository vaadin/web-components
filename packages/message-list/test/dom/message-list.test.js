import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-message-list.js';

describe('vaadin-message-list', () => {
  let list;

  beforeEach(() => {
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
});
