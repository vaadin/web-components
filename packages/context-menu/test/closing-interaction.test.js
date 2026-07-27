import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './closing-animation-styles.js';
import '../src/vaadin-context-menu.js';
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';

describe('interaction while closing', () => {
  let menu, overlay, items;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
    overlay = menu._overlayElement;
    menu.renderer = (root) => {
      root.innerHTML = `
        <vaadin-list-box>
          <vaadin-item>item1</vaadin-item>
          <vaadin-item>item2</vaadin-item>
        </vaadin-list-box>
      `;
    };
    await nextRender();

    menu._setOpened(true);
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender();

    items = [...menu.querySelectorAll('vaadin-item')];
  });

  afterEach(async () => {
    menu._setOpened(false);
    overlay._flushAnimation('closing');
    await resetMouse();
  });

  it('should not dispatch click on a menu item while the overlay is closing', async () => {
    const spy = sinon.spy();
    items[1].addEventListener('click', spy);

    // Selecting an item closes the menu and starts the exit animation
    await sendMouseToElement({ type: 'click', element: items[0] });
    expect(overlay.hasAttribute('closing')).to.be.true;

    await sendMouseToElement({ type: 'click', element: items[1] });

    expect(spy).to.be.not.called;
  });
});
