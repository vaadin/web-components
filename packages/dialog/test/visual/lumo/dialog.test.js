import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../not-animated-styles.js';
import '../../../theme/lumo/vaadin-dialog.js';

describe('dialog', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.height = '100%';

    element = fixtureSync(`<vaadin-dialog></vaadin-dialog>`, div);
    element.renderer = (root) => {
      if (!root.firstChild) {
        const div = document.createElement('div');
        div.textContent = 'Simple dialog with text';
        root.appendChild(div);
      }
    };
    element.opened = true;
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('modeless', async () => {
    element.modeless = true;
    await visualDiff(div, 'modeless');
  });
});
