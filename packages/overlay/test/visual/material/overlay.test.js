import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { executeServerCommand } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-overlay.js';

describe('overlay', () => {
  let div, element;

  before(async () => {
    await executeServerCommand('set-window-height', { height: 610 });
  });

  beforeEach(() => {
    div = document.createElement('div');
    div.style.height = '100%';

    element = fixtureSync('<vaadin-overlay></vaadin-overlay>', div);
    element.renderer = (root) => {
      root.textContent = 'Simple overlay with text';
    };
  });

  it('basic', async () => {
    element.opened = true;
    await visualDiff(div, 'basic');
  });

  it('with-backdrop', async () => {
    element.withBackdrop = true;
    element.opened = true;
    await visualDiff(div, 'with-backdrop');
  });
});
