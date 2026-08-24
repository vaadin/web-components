import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '@vaadin/dialog/src/vaadin-dialog.js';
import '@vaadin/select/src/vaadin-select.js';

describe('select in dialog', () => {
  let dialog, select;

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-dialog modeless header-title="Title">
        <button slot="header-content">Action</button>
        <vaadin-select no-vertical-overlap></vaadin-select>
      </vaadin-dialog>
    `);
    fixtureSync(`
      <style>
        /* Make sendMouseToElement click button */
        vaadin-dialog::part(header-content) {
          justify-content: center;
        }
      </style>
    `);
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    select = dialog.querySelector('vaadin-select');
    select.items = [
      { label: 'Option 1', value: 'value-1' },
      { label: 'Option 2', value: 'value-2' },
    ];
    select.opened = true;
    await nextRender();
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should close the select on dialog header title click', async () => {
    // Use title slot part instead of the actual slotted title HTML element,
    // since `getBoundingClientRect()` for the latter returns 0 coordinates.
    const title = dialog.$.overlay.shadowRoot.querySelector('[part="title"]');

    await sendMouseToElement({ type: 'click', element: title });

    expect(select.opened).to.be.false;
  });

  it('should not click dialog header button when closing select overlay', async () => {
    const spy = sinon.spy();
    dialog.querySelector('button').addEventListener('click', spy);

    // Use header content part instead of the actual slotted button element,
    // since `getBoundingClientRect()` for the latter returns 0 coordinates.
    const header = dialog.$.overlay.shadowRoot.querySelector('[part="header-content"]');
    await sendMouseToElement({ type: 'click', element: header });

    expect(spy).to.be.not.called;
    expect(select.opened).to.be.false;
  });

  it('should keep the select overlay on top of dialog on select mousedown', () => {
    mousedown(select.focusElement);

    expect(select.$.overlay._last).to.be.true;
    expect(dialog.$.overlay._last).to.be.false;
  });

  it('should keep the select overlay on top of dialog on label mousedown', () => {
    mousedown(select._labelNode);

    expect(select.$.overlay._last).to.be.true;
    expect(dialog.$.overlay._last).to.be.false;
  });
});
