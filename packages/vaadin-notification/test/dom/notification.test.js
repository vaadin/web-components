import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-notification.js';

describe('vaadin-notification', () => {
  let notification;

  beforeEach(() => {
    notification = fixtureSync('<vaadin-notification></vaadin-notification>');
  });

  it('default', async () => {
    await expect(notification).shadowDom.to.equalSnapshot();
  });

  it('theme', async () => {
    notification.setAttribute('theme', 'small');
    await expect(notification).shadowDom.to.equalSnapshot();
  });
});
