import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/dialog';
import '@vaadin/select';

describe('select in dialog', () => {
  let dialog, select;

  beforeEach(async () => {
    dialog = fixtureSync(`
      <vaadin-dialog modeless header-title="Title">
        <vaadin-select no-vertical-overlap></vaadin-select>
      </vaadin-dialog>
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
