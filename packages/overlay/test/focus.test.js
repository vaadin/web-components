import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent, tabKeyDown } from '@vaadin/testing-helpers';
import './fixtures/mock-overlay.js';
import { getDeepActiveElement, getTabbableElements, isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';

describe('autofocus', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-overlay autofocus></mock-overlay>');
    overlay.renderer = (root) => {
      if (!root.firstChild) {
        root.innerHTML = `
          <button>Button 1</button>
          <button>Button 2</button>
        `;
      }
    };
    await nextRender();
  });

  afterEach(() => {
    overlay.opened = false;
  });

  async function open() {
    overlay.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
  }

  it('should focus the overlay part when opened', async () => {
    await open();
    expect(isElementFocused(overlay.$.overlay)).to.be.true;
  });

  it('should not focus any element when autofocus is false', async () => {
    overlay.autofocus = false;
    await open();
    expect(getDeepActiveElement()).to.equal(document.body);
  });

  it('should not focus any element when the overlay is not visible', async () => {
    overlay.parentElement.style.visibility = 'hidden';
    await open();
    expect(getDeepActiveElement()).to.equal(document.body);
  });

  it('should not move focus when an element inside the overlay is already focused', async () => {
    overlay.renderer = (root) => {
      root.innerHTML = `
        <button>Button 1</button>
        <button>Button 2</button>
      `;
      root.querySelectorAll('button')[1].focus();
    };
    await open();
    expect(isElementFocused(overlay.querySelectorAll('button')[1])).to.be.true;
  });
});

describe('focus-trap', () => {
  let overlay, overlayPart, focusableElements;

  function getFocusedElementIndex() {
    return focusableElements.findIndex(isElementFocused);
  }

  describe('focusable elements', () => {
    beforeEach(async () => {
      overlay = fixtureSync('<mock-overlay focus-trap></mock-overlay>');
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
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      overlayPart = overlay.$.overlay;
      focusableElements = getTabbableElements(overlayPart);
    });

    afterEach(() => {
      overlay.opened = false;
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
      overlay = fixtureSync('<mock-overlay></mock-overlay>');
      await nextRender();
      overlayPart = overlay.$.overlay;
    });

    it('should focus the overlay part when focusTrap = true', async () => {
      overlay.focusTrap = true;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getTabbableElements(overlayPart);
      expect(focusableElements[0]).to.equal(overlayPart);
      expect(getFocusedElementIndex()).to.equal(0);
    });

    it('should not focus the overlay part when focusTrap = false', async () => {
      overlay.focusTrap = false;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getTabbableElements(overlayPart);
      expect(getFocusedElementIndex()).to.equal(-1);
    });

    it('should not focus the overlay part when overlay is not visible', async () => {
      overlay.parentElement.style.visibility = 'hidden';
      overlay.focusTrap = true;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getTabbableElements(overlayPart);
      expect(getFocusedElementIndex()).to.equal(-1);
    });
  });

  describe('nested overlay', () => {
    let nested;

    beforeEach(async () => {
      overlay = fixtureSync('<mock-overlay focus-trap></mock-overlay>');
      overlay.renderer = (root) => {
        if (!root.firstChild) {
          const button = document.createElement('button');
          button.textContent = 'Button';
          root.appendChild(button);

          const nested = document.createElement('mock-overlay');
          nested.renderer = (root) => {
            root.textContent = 'Inner content';
          };
          root.appendChild(nested);
        }
      };
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getTabbableElements(overlay.$.overlay);
      nested = overlay.querySelector('mock-overlay');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should not release focus when closing nested overlay without focus-trap', async () => {
      nested.opened = true;
      await oneEvent(nested, 'vaadin-overlay-open');

      nested.opened = false;

      const button = overlay.querySelector('button');
      button.focus();
      tabKeyDown(button);

      expect(getFocusedElementIndex()).to.equal(0);
    });
  });
});
