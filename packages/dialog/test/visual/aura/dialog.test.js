import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../not-animated-styles.js';
import '../../../vaadin-dialog.js';
import { createRenderer } from '../../helpers.js';

describe('dialog', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.height = '100%';

    element = fixtureSync(`<vaadin-dialog></vaadin-dialog>`, div);
    element.renderer = createRenderer('Simple dialog with text');
    element.opened = true;
    await nextRender();
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('modeless', async () => {
    element.modeless = true;
    await nextUpdate(element);
    await visualDiff(div, 'modeless');
  });

  it('title', async () => {
    element.headerTitle = 'Title';
    await nextUpdate(element);
    await visualDiff(div, 'header-title');
  });
});
