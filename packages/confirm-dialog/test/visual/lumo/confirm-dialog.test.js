import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/test/autoload.js';
import '../../../theme/lumo/vaadin-confirm-dialog.js';
import '../../not-animated-styles.js';

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
    await oneEvent(element.$.dialog.$.overlay, 'vaadin-overlay-open');
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('cancel', async () => {
    element.cancel = true;
    await visualDiff(div, 'cancel');
  });

  it('reject', async () => {
    element.reject = true;
    await visualDiff(div, 'reject');
  });

  it('cancel reject', async () => {
    element.cancel = true;
    element.reject = true;
    await visualDiff(div, 'cancel-reject');
  });
});
