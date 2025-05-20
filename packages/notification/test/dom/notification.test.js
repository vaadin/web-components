import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../../vaadin-notification.js';

describe('vaadin-notification', () => {
  let notification, card;

  beforeEach(async () => {
    notification = fixtureSync('<vaadin-notification></vaadin-notification>');
    await nextRender();
    card = notification._card;
    notification.renderer = (root) => {
      root.textContent = 'content';
    };
    notification.opened = true;
    await oneEvent(card, 'animationend');
  });

  it('card', async () => {
    await expect(card).dom.to.equalSnapshot();
  });

  it('card theme', async () => {
    notification.setAttribute('theme', 'custom');
    await nextUpdate(notification);
    await expect(card).dom.to.equalSnapshot();
  });

  it('card class', async () => {
    notification.overlayClass = 'custom';
    await nextUpdate(notification);
    await expect(card).dom.to.equalSnapshot();
  });

  it('assertive', async () => {
    notification.assertive = true;
    await expect(card).dom.to.equalSnapshot();
  });
});
