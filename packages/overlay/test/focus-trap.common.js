import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextRender, oneEvent, tabKeyDown } from '@vaadin/testing-helpers';
import { getFocusableElements, isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';

describe('focus-trap', () => {
  let overlay, overlayPart, focusableElements;

  function getFocusedElementIndex() {
    return focusableElements.findIndex(isElementFocused);
  }

  describe('focusable elements', () => {
    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-overlay focus-trap></vaadin-overlay>');
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
      await nextRender();
      overlayPart = overlay.$.overlay;
      overlay.requestContentUpdate();
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getFocusableElements(overlayPart);
    });

    afterEach(async () => {
      overlay.opened = false;
      await nextRender();
    });

    it('should properly detect focusable elements inside the content', () => {
      expect(focusableElements.length).to.equal(5);
      expect(focusableElements[0]).to.equal(overlay.querySelector('textarea'));
      expect(focusableElements[1]).to.equal(overlay.querySelector('select'));
      expect(focusableElements[2]).to.equal(overlayPart);
      expect(focusableElements[3]).to.equal(overlay.querySelector('button'));
      expect(focusableElements[4]).to.equal(overlay.querySelector('input'));
    });

    it('should focus focusable elements inside the content when focusTrap = true', () => {
      // Tab
      for (let i = 0; i < focusableElements.length; i++) {
        const focusedIndex = getFocusedElementIndex();
        expect(focusedIndex).to.equal(i);
        tabKeyDown(focusableElements[focusedIndex]);
      }
      expect(getFocusedElementIndex()).to.equal(0);

      // Shift + Tab
      tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);

      for (let i = focusableElements.length - 1; i >= 0; i--) {
        const focusedIndex = getFocusedElementIndex();
        expect(focusedIndex).to.equal(i);
        tabKeyDown(focusableElements[focusedIndex], ['shift']);
      }
      expect(getFocusedElementIndex()).to.equal(focusableElements.length - 1);
    });

    it('should update focus sequence when focusing a random element', () => {
      tabKeyDown(document.body);
      expect(getFocusedElementIndex()).to.equal(1);

      focusableElements[0].focus();
      tabKeyDown(document.body);
      expect(getFocusedElementIndex()).to.equal(1);
    });
  });

  describe('empty', () => {
    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-overlay></vaadin-overlay>');
      await nextRender();
      overlayPart = overlay.$.overlay;
    });

    it('should focus the overlay part when focusTrap = true', async () => {
      overlay.focusTrap = true;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getFocusableElements(overlayPart);
      expect(focusableElements[0]).to.equal(overlayPart);
      expect(getFocusedElementIndex()).to.equal(0);
    });

    it('should not focus the overlay part when focusTrap = false', async () => {
      overlay.focusTrap = false;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getFocusableElements(overlayPart);
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

  describe('aria-hidden', () => {
    let outer, inner, overlay;

    beforeEach(async () => {
      // Create outer element and pass it explicitly.
      outer = document.createElement('main');

      // Our `fixtureSync()` requires a single parent.
      inner = fixtureSync(
        `
        <div>
          <button>Foo</button>
          <vaadin-overlay focus-trap></vaadin-overlay>
          <button>Bar</button>
        </div>
      `,
        outer,
      );

      overlay = inner.querySelector('vaadin-overlay');
      await nextRender();
      overlay.renderer = (root) => {
        root.innerHTML = '<input placeholder="Input">';
      };
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should set aria-hidden on other elements on overlay open', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(outer.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should remove aria-hidden from other elements on overlay close', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      overlay.opened = false;
      await aTimeout(0);

      expect(outer.hasAttribute('aria-hidden')).to.be.false;
    });

    it('should not set aria-hidden on other elements if focusTrap is set to false', async () => {
      overlay.focusTrap = false;

      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(outer.hasAttribute('aria-hidden')).to.be.false;
    });
  });
});
