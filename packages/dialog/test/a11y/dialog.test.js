import { expect } from '@vaadin/chai-plugins';
import { a11ySnapshotOfElement, findAccessibilityNode } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../not-animated-styles.css';
import '../../src/vaadin-dialog.js';

describe('vaadin-dialog', () => {
  let dialog;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    await nextRender();
    dialog.renderer = (root) => {
      root.textContent = 'Content';
    };
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
  });

  it('default', async () => {
    await expect(dialog).to.equalA11yTreeSnapshot();
    // Known issue: the dialog has no accessible name without `headerTitle`.
    // See https://github.com/vaadin/web-components/issues/13002
    await expect(dialog).to.be.accessible({ ignoredRules: ['aria-dialog-name'] });
  });

  it('header title', async () => {
    dialog.headerTitle = 'Title';
    await nextUpdate(dialog);
    await expect(dialog).to.equalA11yTreeSnapshot();
    await expect(dialog).to.be.accessible();
  });

  it('header and footer', async () => {
    dialog.headerTitle = 'Title';
    dialog.headerRenderer = (root) => {
      root.innerHTML = '<button aria-label="Close">×</button>';
    };
    dialog.footerRenderer = (root) => {
      root.innerHTML = '<button>Cancel</button><button>Save</button>';
    };
    await nextRender();
    await expect(dialog).to.equalA11yTreeSnapshot();
    await expect(dialog).to.be.accessible();
  });

  it('aria-label', async () => {
    dialog.ariaLabel = 'Edit user';
    await nextUpdate(dialog);
    await expect(dialog).to.equalA11yTreeSnapshot();
    await expect(dialog).to.be.accessible();
  });

  it('heading level', async () => {
    dialog.headerTitle = 'Title';
    dialog.headingLevel = 3;
    // The snapshot lists the content of a dialog only when it has a focusable element.
    dialog.footerRenderer = (root) => {
      root.innerHTML = '<button>Close</button>';
    };
    await nextRender();
    const snapshot = await a11ySnapshotOfElement(dialog);
    const heading = findAccessibilityNode(snapshot, (node) => node.role === 'heading');
    expect(heading).to.include({ name: 'Title', level: 3 });
  });

  it('modeless', async () => {
    dialog.headerTitle = 'Title';
    dialog.modeless = true;
    await nextUpdate(dialog);
    await expect(dialog).to.equalA11yTreeSnapshot();
    await expect(dialog).to.be.accessible();
  });

  it('overlay role', async () => {
    dialog.headerTitle = 'Title';
    dialog.overlayRole = 'alertdialog';
    await nextUpdate(dialog);
    await expect(dialog).to.equalA11yTreeSnapshot();
    await expect(dialog).to.be.accessible();
  });
});
