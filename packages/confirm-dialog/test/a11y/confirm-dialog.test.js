import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../not-animated-styles.css';
import '../../src/vaadin-confirm-dialog.js';

describe('vaadin-confirm-dialog', () => {
  let dialog;

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-confirm-dialog header="Unsaved changes">
        Do you want to save or discard the changes?
      </vaadin-confirm-dialog>
    `);
    await nextRender();
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
  });

  it('default', async () => {
    await expect(dialog).to.equalA11yTreeSnapshot();
    await expect(dialog).to.be.accessible();
  });

  it('cancel and reject buttons', async () => {
    dialog.cancelButtonVisible = true;
    dialog.rejectButtonVisible = true;
    dialog.rejectText = 'Discard';
    dialog.confirmText = 'Save';
    await nextUpdate(dialog);
    await expect(dialog).to.equalA11yTreeSnapshot();
    await expect(dialog).to.be.accessible();
  });

  it('heading level', async () => {
    dialog.headingLevel = 2;
    await nextUpdate(dialog);
    await expect(dialog).to.matchA11yTree('- heading "Unsaved changes" [level=2]');
  });

  it('no header', async () => {
    dialog.header = '';
    await nextUpdate(dialog);
    await expect(dialog).to.equalA11yTreeSnapshot();
    // Known issue: the header heading is rendered even when it is empty,
    // and the dialog falls back to the generic "confirmation" name.
    // See https://github.com/vaadin/web-components/issues/13002
    await expect(dialog).to.be.accessible({ expectedViolations: ['empty-heading'] });
  });

  it('accessible description ref', async () => {
    dialog.header = 'Delete account';
    // Replace the message text, but keep the slotted header and buttons.
    [...dialog.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => node.remove());
    dialog.insertAdjacentHTML('beforeend', '<p id="warning">This cannot be undone.</p><p>Enter your password.</p>');
    dialog.accessibleDescriptionRef = 'warning';
    await nextUpdate(dialog);
    await expect(dialog).to.equalA11yTreeSnapshot();
    await expect(dialog).to.be.accessible();
  });
});
