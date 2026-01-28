import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-dashboard-button.js';
import type { DashboardButton } from '../../src/vaadin-dashboard-button.js';

describe('vaadin-dashboard-button', () => {
  let button: DashboardButton;

  beforeEach(async () => {
    button = fixtureSync('<vaadin-dashboard-button></vaadin-dashboard-button>');
    await nextRender();
  });

  it('host', async () => {
    await expect(button).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(button).shadowDom.to.equalSnapshot();
  });
});
