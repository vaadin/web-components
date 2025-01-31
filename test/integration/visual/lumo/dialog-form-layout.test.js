import { executeServerCommand } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../not-animated-styles.js';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item.js';
import { html, render } from 'lit';

describe('dialog-form-layout', () => {
  let div, dialog;

  before(async () => {
    await executeServerCommand('set-window-height', { height: 610 });
  });

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.height = '100%';

    dialog = fixtureSync(`<vaadin-dialog header-title="Form Layout"></vaadin-dialog>`, div);
    dialog.renderer = (root) => {
      render(
        html`
          <vaadin-form-layout>
            <vaadin-form-item>
              <label slot="label">First name</label>
              <vaadin-text-field></vaadin-text-field>
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">Last name</label>
              <vaadin-text-field></vaadin-text-field>
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">Email</label>
              <vaadin-text-field></vaadin-text-field>
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">Phone</label>
              <vaadin-text-field></vaadin-text-field>
            </vaadin-form-item>
          </vaadin-form-layout>
        `,
        root,
      );
    };
    dialog.opened = true;
    await nextRender();
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });
});
