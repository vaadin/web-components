import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
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

  it('primary', async () => {
    element.setAttribute('theme', 'primary');
    await visualDiff(div, 'primary');
  });

  it('tertiary', async () => {
    element.setAttribute('theme', 'tertiary');
    await visualDiff(div, 'tertiary');
  });

  describe('accent', () => {
    ['neutral', 'green', 'yellow', 'purple', 'orange', 'blue', 'red'].forEach((color) => {
      it(color, async () => {
        element.classList.add(`aura-accent-${color}`);
        await visualDiff(div, `accent-${color}`);
      });
    });
  });
});
