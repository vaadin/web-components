import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';

describe('selection', () => {
  let menu, overlay;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
    overlay = menu._overlayElement;
    menu.renderer = (root) => {
      root.innerHTML = `
        <vaadin-list-box id="menu">
          <vaadin-item>item1</vaadin-item>
          <vaadin-item>item2</vaadin-item>
          <vaadin-item>item3</vaadin-item>
        </vaadin-list-box>
      `;
    };
    await nextRender();
  });

  it('should focus the child element', async () => {
    menu._setOpened(true);
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender();

    const item = menu.querySelector('#menu vaadin-item');
    expect(document.activeElement).to.eql(item);
  });
});
