import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
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
    await expect(card).dom.to.equalSnapshot();
  });
});
