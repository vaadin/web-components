import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../not-animated-styles.css';
import '../../src/vaadin-popover.js';

describe('vaadin-popover', () => {
  let wrapper, popover;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <button id="target">Settings</button>
        <vaadin-popover for="target" accessible-name="Settings">
          <label><input type="checkbox" /> Dark mode</label>
        </vaadin-popover>
      </div>
    `);
    popover = wrapper.querySelector('vaadin-popover');
    await nextRender();
  });

  const open = async () => {
    popover.opened = true;
    await oneEvent(popover.$.overlay, 'vaadin-overlay-open');
  };

  it('closed', async () => {
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('opened', async () => {
    await open();
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('modal', async () => {
    popover.modal = true;
    await open();
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('no accessible name', async () => {
    popover.accessibleName = null;
    await open();
    await expect(wrapper).to.equalA11yTreeSnapshot();
    // A popover with the dialog role needs `accessibleName` or `accessibleNameRef`.
    await expect(wrapper).to.be.accessible({ expectedViolations: ['aria-dialog-name'] });
  });

  it('accessible name ref', async () => {
    popover.accessibleName = null;
    popover.insertAdjacentHTML('afterbegin', '<h3 id="popover-title">Display settings</h3>');
    popover.accessibleNameRef = 'popover-title';
    await open();
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('overlay role', async () => {
    popover.overlayRole = 'alertdialog';
    await nextUpdate(popover);
    await open();
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('hover trigger', async () => {
    popover.trigger = ['hover'];
    popover.hoverDelay = 0;
    await nextUpdate(popover);
    const opened = oneEvent(popover.$.overlay, 'vaadin-overlay-open');
    await sendMouseToElement({ type: 'move', element: wrapper.querySelector('#target') });
    await opened;
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
    await resetMouse();
  });
});
