import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, oneEvent, tabKeyDown } from '@vaadin/testing-helpers';
import '../vaadin-overlay.js';
import { getFocusableElements, isElementFocused } from '@vaadin/component-base/src/focus-utils.js';

describe('focus-trap', () => {
  let overlay, overlayPart, focusableElements;

  function getFocusedElementIndex() {
    return focusableElements.findIndex(isElementFocused);
  }

  describe('focusable elements', () => {
    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-overlay focus-trap></vaadin-overlay>');
      await nextRender();
      overlayPart = overlay.$.overlay;
      overlay.renderer = (root) => {
        if (!root.firstChild) {
          root.innerHTML = `
            <button>tabindex 0</button>
            <button tabindex="-1">tabindex -1</button>
            <select tabindex="2">
              <option>tabindex 2</option>
            </select>
            <textarea tabindex="1">tabindex 1</textarea>
            <input type="text" id="text" value="tabindex 0" />
          `;
        }
      };
      overlay.requestContentUpdate();
      focusableElements = getFocusableElements(overlayPart);
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should properly detect focusable elements inside the content', () => {
      expect(focusableElements.length).to.equal(5);
      expect(focusableElements[0]).to.equal(overlay.querySelector('textarea'));
      expect(focusableElements[1]).to.eql(overlay.querySelector('select'));
      expect(focusableElements[2]).to.eql(overlayPart);
      expect(focusableElements[3]).to.eql(overlay.querySelector('button'));
      expect(focusableElements[4]).to.eql(overlay.querySelector('input'));
    });

    it('should focus focusable elements inside the content when focusTrap = true', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      // Tab
      for (let i = 0; i < focusableElements.length; i++) {
        const focusedIndex = getFocusedElementIndex();
        expect(focusedIndex).to.equal(i);
        tabKeyDown(focusableElements[focusedIndex]);
      }
      expect(getFocusedElementIndex()).to.eql(0);

      // Shift + Tab
      tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);

      for (let i = focusableElements.length - 1; i >= 0; i--) {
        const focusedIndex = getFocusedElementIndex();
        expect(focusedIndex).to.equal(i);
        tabKeyDown(focusableElements[focusedIndex], ['shift']);
      }
      expect(getFocusedElementIndex()).to.eql(focusableElements.length - 1);
    });

    it('should update focus sequence when focusing a random element', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      tabKeyDown(document.body);
      expect(getFocusedElementIndex()).to.eql(1);

      focusableElements[0].focus();
      tabKeyDown(document.body);
      expect(getFocusedElementIndex()).to.eql(1);
    });
  });

  describe('empty', () => {
    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-overlay focus-trap></vaadin-overlay>');
      await nextRender();
      overlayPart = overlay.$.overlay;
      focusableElements = getFocusableElements(overlayPart);
    });

    it('should focus the overlay part when focusTrap = true', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(focusableElements[0]).to.be.eql(overlayPart);
      expect(getFocusedElementIndex()).to.eql(0);
    });

    it('should not focus the overlay part when focusTrap = false', async () => {
      overlay.focusTrap = false;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(getFocusedElementIndex()).to.equal(-1);
    });
  });

  describe('nested overlay', () => {
    let nested;

    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-overlay focus-trap></vaadin-overlay>');
      await nextRender();
      overlay.renderer = (root) => {
        if (!root.firstChild) {
          const button = document.createElement('button');
          button.textContent = 'Button';
          root.appendChild(button);

          const nested = document.createElement('vaadin-overlay');
          nested.renderer = (root) => {
            root.textContent = 'Inner content';
          };
          root.appendChild(nested);
        }
      };
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getFocusableElements(overlay.$.overlay);
      await nextRender();
      nested = overlay.querySelector('vaadin-overlay');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should not release focus when closing nested overlay without focus-trap', async () => {
      nested.opened = true;
      await nextRender();
      nested.opened = false;

      const button = overlay.querySelector('button');
      button.focus();
      tabKeyDown(button);

      expect(getFocusedElementIndex()).to.equal(0);
    });
  });
});
