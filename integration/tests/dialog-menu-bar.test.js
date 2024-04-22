import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/dialog';
import '@vaadin/menu-bar';
import '@vaadin/vertical-layout';

// Do not import `not-animated-styles.js` as the original issue that
// this test covers was caused by the Lumo dialog opening animation.

describe('menu-bar in dialog', () => {
  let dialog, overlay, menuBar;

  beforeEach(async () => {
    dialog = fixtureSync(`<vaadin-dialog theme="no-padding"></vaadin-dialog>`);
    dialog.renderer = (root) => {
      if (!root.firstChild) {
        root.$.overlay.style.width = '700px';
        root.innerHTML = `
          <vaadin-vertical-layout theme="padding spacing" style="width: 100%; align-items: stretch;">
            <vaadin-menu-bar style="min-width: var(--lumo-size-m);"></vaadin-menu-bar>
          </vaadin-vertical-layout>
        `;
        const menu = root.querySelector('vaadin-menu-bar');
        menu.items = [
          { text: 'Hello 1' },
          { text: 'Hello 2' },
          { text: 'Hello 3' },
          { text: 'Hello 4' },
          { text: 'Hello 5' },
          { text: 'Hello 6' },
          { text: 'Hello 7' },
          { text: 'Hello 8' },
          { text: 'Hello 9' },
        ];
      }
    };
    await nextRender();
    dialog.opened = true;
    overlay = dialog.$.overlay;
    await oneEvent(overlay, 'vaadin-overlay-open');
    menuBar = overlay.querySelector('vaadin-menu-bar');
  });

  it('should fully fit the overflow button in the menu-bar', () => {
    const overflow = menuBar._overflow;
    expect(overflow.offsetLeft + overflow.offsetWidth).to.be.lessThan(menuBar.offsetLeft + menuBar.offsetWidth);
  });

  it('should place correct elements in the overflow menu', () => {
    const overflow = menuBar._overflow;
    expect(overflow.item.children[0]).to.deep.equal(menuBar.items[7]);
    expect(overflow.item.children[1]).to.deep.equal(menuBar.items[8]);
  });
});
