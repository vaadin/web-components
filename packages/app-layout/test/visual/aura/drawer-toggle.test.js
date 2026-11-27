import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '@vaadin/tooltip/test/not-animated-styles.css';
import '../../../vaadin-drawer-toggle.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';
import { mouseenter } from '@vaadin/tooltip/test/helpers.js';

describe('drawer-toggle', () => {
  let div, element;

  before(() => {
    Tooltip.setDefaultHoverDelay(0);
  });

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

  it('tooltip', async () => {
    div.style.width = '120px';
    div.style.height = '100px';
    div.style.textAlign = 'center';
    element.innerHTML = '<vaadin-tooltip slot="tooltip" text="Toggle"></vaadin-tooltip>';
    await nextRender();
    mouseenter(element);
    await nextRender();
    await visualDiff(div, 'tooltip');
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
