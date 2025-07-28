import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/dialog';
import '@vaadin/menu-bar/test/menu-bar-test-styles.js';
import '@vaadin/menu-bar/src/vaadin-menu-bar.js';
import '@vaadin/vertical-layout/src/vaadin-vertical-layout.js';

// Do not import `not-animated-styles.js` as the original issue that
// this test covers was caused by the Lumo dialog opening animation.

describe('menu-bar in dialog', () => {
  let dialog, menuBar;

  beforeEach(async () => {
    fixtureSync(`
      <style>
        vaadin-dialog::part(content) {
          padding: 0;
        }
      </style>
    `);
    dialog = fixtureSync(`<vaadin-dialog width="700px"></vaadin-dialog>`);
    dialog.renderer = (root) => {
      if (!root.firstChild) {
        root.innerHTML = `
          <vaadin-vertical-layout theme="padding spacing" style="width: 100%; align-items: stretch;">
            <vaadin-menu-bar style="min-width: 2.25rem;"></vaadin-menu-bar>
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
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    menuBar = dialog.querySelector('vaadin-menu-bar');
    await nextResize(menuBar);
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
