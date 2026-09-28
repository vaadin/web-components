import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent, tabKeyDown } from '@vaadin/testing-helpers';
import './fixtures/mock-overlay.js';
import './fixtures/mock-unmanaged-overlay.js';
import { getDeepActiveElement, getTabbableElements, isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';

// A component that is not focusable itself, like a field that forwards focus to its input
customElements.define('autofocus-host', class extends HTMLElement {});

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

  describe('element with autofocus', () => {
    function setContent(html) {
      overlay.renderer = (root) => {
        if (!root.firstChild) {
          root.innerHTML = html;
        }
      };
    }

    function getButton(index) {
      return overlay.querySelectorAll('button')[index];
    }

    it('should focus the element with autofocus attribute when opened', async () => {
      setContent('<button>Button 1</button><button autofocus>Button 2</button>');
      await open();
      expect(isElementFocused(getButton(1))).to.be.true;
    });

    it('should focus the element inside a component with autofocus when opened', async () => {
      setContent('<button>Button 1</button><autofocus-host autofocus><button>Button 2</button></autofocus-host>');
      await open();
      expect(isElementFocused(getButton(1))).to.be.true;
    });

    it('should not focus the element inside a plain element with autofocus when opened', async () => {
      setContent('<button>Button 1</button><div autofocus><button>Button 2</button></div>');
      await open();
      expect(isElementFocused(overlay.$.overlay)).to.be.true;
    });

    it('should focus the element with autofocus when autofocus is false', async () => {
      overlay.autofocus = false;
      setContent('<button>Button 1</button><button autofocus>Button 2</button>');
      await open();
      expect(isElementFocused(getButton(1))).to.be.true;
    });
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

describe('manageFocus', () => {
  let wrapper, overlay, outsideButton;

  function createOverlay(tag) {
    wrapper = fixtureSync(`
      <div>
        <button id="outside">Outside</button>
        <${tag} autofocus focus-trap restore-focus-on-close></${tag}>
      </div>
    `);
    outsideButton = wrapper.querySelector('#outside');
    overlay = wrapper.lastElementChild;
    overlay.renderer = (root) => {
      if (!root.firstChild) {
        root.innerHTML = `
          <button>Button 1</button>
          <button>Button 2</button>
        `;
      }
    };
  }

  async function open() {
    overlay.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
  }

  afterEach(() => {
    overlay.opened = false;
  });

  describe('default', () => {
    beforeEach(async () => {
      createOverlay('mock-overlay');
      await nextRender();
      outsideButton.focus();
    });

    it('should move focus into the overlay on open', async () => {
      await open();
      expect(isElementFocused(overlay.$.overlay)).to.be.true;
    });

    it('should wrap focus to the first element on Tab from the last element', async () => {
      await open();
      const tabbables = getTabbableElements(overlay.$.overlay);
      const last = tabbables[tabbables.length - 1];
      last.focus();
      tabKeyDown(last);
      expect(isElementFocused(tabbables[0])).to.be.true;
    });

    it('should restore focus on close', async () => {
      await open();
      overlay.opened = false;
      expect(isElementFocused(outsideButton)).to.be.true;
    });
  });

  describe('false', () => {
    beforeEach(async () => {
      createOverlay('mock-unmanaged-overlay');
      await nextRender();
      outsideButton.focus();
    });

    it('should not move focus into the overlay on open', async () => {
      await open();
      expect(isElementFocused(outsideButton)).to.be.true;
    });

    it('should not wrap focus to the first element on Tab from the last element', async () => {
      await open();
      const tabbables = getTabbableElements(overlay.$.overlay);
      const last = tabbables[tabbables.length - 1];
      last.focus();
      tabKeyDown(last);
      expect(isElementFocused(tabbables[0])).to.be.false;
    });

    it('should not restore focus on close', async () => {
      await open();
      overlay.querySelector('button').focus();
      overlay.opened = false;
      expect(isElementFocused(outsideButton)).to.be.false;
    });
  });
});
