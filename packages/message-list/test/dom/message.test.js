import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-message.js';

describe('vaadin-message', () => {
  let message;

  beforeEach(() => {
    message = fixtureSync('<vaadin-message></vaadin-message>');
  });

  it('default', async () => {
    await expect(message).shadowDom.to.equalSnapshot();
  });

  it('userName', async () => {
    message.userName = 'Joan Doe';
    await nextUpdate(message);
    await expect(message).shadowDom.to.equalSnapshot();
  });

  it('time', async () => {
    message.time = 'long ago';
    await nextUpdate(message);
    await expect(message).shadowDom.to.equalSnapshot();
  });

  it('avatar username', async () => {
    message.userName = 'Joan Doe';
    await nextUpdate(message);
    await expect(message).dom.to.equalSnapshot();
  });

  it('avatar abbr', async () => {
    message.userAbbr = 'JD';
    await nextUpdate(message);
    await expect(message).dom.to.equalSnapshot();
  });

  it('avatar img', async () => {
    message.userImg = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    await nextUpdate(message);
    await expect(message).dom.to.equalSnapshot();
  });

  it('avatar userColorIndex', async () => {
    document.documentElement.style.setProperty('--vaadin-user-color-2', 'green');
    message.userColorIndex = 2;
    await nextUpdate(message);
    await expect(message).dom.to.equalSnapshot();
  });
});
