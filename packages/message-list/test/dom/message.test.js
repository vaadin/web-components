import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-message.js';

describe('vaadin-message', () => {
  const SNAPSHOT_CONFIG = {
    // Exclude custom CSS property set as inline style,
    // as corresponding logic is covered by unit tests.
    ignoreAttributes: ['style'],
  };

  let message;

  beforeEach(() => {
    message = fixtureSync('<vaadin-message></vaadin-message>');
  });

  it('default', async () => {
    await expect(message).shadowDom.to.equalSnapshot();
  });

  it('userName', async () => {
    message.userName = 'Joan Doe';
    await expect(message).shadowDom.to.equalSnapshot();
  });

  it('userAbbr', async () => {
    message.userAbbr = 'JD';
    await expect(message).shadowDom.to.equalSnapshot();
  });

  it('userImg', async () => {
    message.userImg = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    await expect(message).shadowDom.to.equalSnapshot();
  });

  it('userColorIndex', async () => {
    document.documentElement.style.setProperty('--vaadin-user-color-2', 'green');
    message.userColorIndex = 2;
    await expect(message).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('time', async () => {
    message.time = 'long ago';
    await expect(message).shadowDom.to.equalSnapshot();
  });
});
