import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/drawer-toggle.css';
import '../../../vaadin-drawer-toggle.js';

describe('drawer-toggle', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-drawer-toggle></vaadin-drawer-toggle>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('active', async () => {
    element.setAttribute('active', '');
    await visualDiff(div, 'active');
  });

  it('icon fallback', async () => {
    // Preserve whitespace around the slot to add empty text nodes to make
    // the icon part shown instead of default one (slot fallback content).
    element.innerHTML = `
      <span slot="tooltip"></span>
    `;
    await visualDiff(div, 'icon-fallback');
  });
});
