import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-confirm-dialog.js';

describe('confirm-dialog', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.height = '100%';

    element = fixtureSync(
      `
        <vaadin-confirm-dialog header="Action required" opened>
          Please press a button to confirm.
        </vaadin-confirm-dialog>
      `,
      div,
    );
    await oneEvent(element.$.overlay, 'vaadin-overlay-open');
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('cancel', async () => {
    element.cancelButtonVisible = true;
    await visualDiff(div, 'cancel');
  });

  it('reject', async () => {
    element.rejectButtonVisible = true;
    await visualDiff(div, 'reject');
  });

  it('cancel reject', async () => {
    element.cancelButtonVisible = true;
    element.rejectButtonVisible = true;
    await visualDiff(div, 'cancel-reject');
  });
});
