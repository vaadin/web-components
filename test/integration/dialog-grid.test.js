import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, keyDownOn, nextFrame } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/grid';
import '@vaadin/dialog/src/vaadin-dialog.js';

describe('grid in dialog', () => {
  let dialog, grid;

  function enter() {
    keyDownOn(grid.shadowRoot.activeElement, 13, [], 'Enter');
  }

  function esc() {
    keyDownOn(document.activeElement, 27, [], 'Escape');
  }

  function focus() {
    grid._itemsFocusable.focus();
  }

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    dialog.renderer = (root) => {
      root.innerHTML = '<vaadin-grid><vaadin-grid-column></vaadin-grid-column></vaadin-grid>';
      const grid = root.firstElementChild;
      grid.items = ['one', 'two'];
      const column = grid.firstElementChild;
      column.renderer = (root, _, model) => {
        if (root.firstElementChild) {
          return;
        }
        root.innerHTML = `<button>Button ${model.item}</button>`;
      };
    };
    dialog.opened = true;
    await nextFrame();
    grid = dialog.querySelector('vaadin-grid');
  });

  afterEach(async () => {
    dialog.opened = false;
    await nextFrame();
  });
  describe('interaction', () => {
    it('should not close on Esc if focus is on interetive element', () => {
      focus();
      enter();
      esc();
      expect(dialog.opened).to.be.ok;
    });

    it('should close on Esc if focus is back to grid cell', () => {
      focus();
      enter();
      esc();
      esc();
      expect(dialog.opened).to.be.not.ok;
    });
  });
});
