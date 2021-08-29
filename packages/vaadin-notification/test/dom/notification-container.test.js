import { expect } from '@esm-bundle/chai';
import '@vaadin/testing-helpers/dist/register-chai-plugins.js';
import '../../src/vaadin-notification.js';

describe('vaadin-notification-container', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('vaadin-notification-container');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Container gets removed from DOM when `opened` property is set to false.
    // We would have to stub `_openedChanged` to use `fixtureSync` helper.
    container.opened = false;
  });

  it('default', async () => {
    await expect(container).shadowDom.to.equalSnapshot();
  });
});
