import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-app-layout.js';
import '../../../vaadin-drawer-toggle.js';

describe('app-layout', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.height = '100%';

    element = fixtureSync(
      `
        <vaadin-app-layout>
          <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
          <h2 slot="navbar">App Name</h2>
          <section slot="drawer">Drawer content</section>
          <main>Page content</main>
        </vaadin-app-layout>
      `,
      div,
    );
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('primary-drawer', async () => {
    element.primarySection = 'drawer';
    await visualDiff(div, 'primary-drawer');
  });

  it('overlay', async () => {
    element.style.setProperty('--vaadin-app-layout-drawer-overlay', 'true');
    window.dispatchEvent(new Event('resize'));
    await visualDiff(div, 'overlay');
  });

  it('overlay-opened', async () => {
    element.style.setProperty('--vaadin-app-layout-drawer-overlay', 'true');
    window.dispatchEvent(new Event('resize'));
    element.drawerOpened = true;
    await visualDiff(div, 'overlay-opened');
  });
});
