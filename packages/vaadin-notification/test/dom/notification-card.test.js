import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-notification.js';

describe('vaadin-notification-card', () => {
  let card;

  beforeEach(() => {
    card = fixtureSync('<vaadin-notification-card></vaadin-notification-card>');
  });

  it('default', async () => {
    await expect(card).shadowDom.to.equalSnapshot();
  });
});
