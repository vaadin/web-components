import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent, tabKeyDown } from '@vaadin/testing-helpers';
import { getFocusableElements, isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { Overlay } from '../src/vaadin-overlay.js';

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
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      overlayPart = overlay.$.overlay;
      focusableElements = getFocusableElements(overlayPart);
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
      nested = overlay.querySelector('vaadin-overlay');
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

  describe('aria-hidden', () => {
    let outer, inner, overlay;

    beforeEach(() => {
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
      expect(outer.hasAttribute('aria-hidden')).to.be.false;
    });

    it('should not set aria-hidden on other elements if focusTrap is set to false', async () => {
      overlay.focusTrap = false;

      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(outer.hasAttribute('aria-hidden')).to.be.false;
    });
  });

  describe('aria-hidden modal root', () => {
    customElements.define(
      'custom-overlay-wrapper',
      class extends HTMLElement {
        constructor() {
          super();

          this.attachShadow({ mode: 'open' });

          const overlay = document.createElement('custom-overlay');

          const owner = document.createElement('div');
          overlay.owner = owner;

          // Forward the slotted content from wrapper to overlay
          const slot = document.createElement('slot');
          overlay.appendChild(slot);

          overlay.focusTrap = true;
          overlay.renderer = (root) => {
            root.innerHTML = '<input placeholder="Input">';
          };

          this.shadowRoot.append(overlay);
          this.append(owner);
        }
      },
    );

    customElements.define(
      'custom-overlay',
      class extends Overlay {
        get _contentRoot() {
          return this.owner;
        }

        get _modalRoot() {
          return this.owner;
        }

        _attachOverlay() {
          this.setAttribute('popover', 'manual');
          this.showPopover();
        }

        _detachOverlay() {
          this.hidePopover();
        }
      },
    );

    let outer, inner, wrapper, overlay;

    beforeEach(() => {
      // Create outer element and pass it explicitly.
      outer = document.createElement('main');

      // Our `fixtureSync()` requires a single parent.
      inner = fixtureSync(
        `
        <div>
          <button>Foo</button>
          <custom-overlay-wrapper></custom-overlay-wrapper>
          <button>Bar</button>
        </div>
      `,
        outer,
      );

      wrapper = inner.querySelector('custom-overlay-wrapper');
      overlay = wrapper.shadowRoot.querySelector('custom-overlay');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should not set aria-hidden on wrapping elements on overlay open', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      expect(outer.hasAttribute('aria-hidden')).to.be.false;
      expect(inner.hasAttribute('aria-hidden')).to.be.false;
      expect(wrapper.hasAttribute('aria-hidden')).to.be.false;
    });

    it('should not set aria-hidden on content root element on overlay open', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      const root = wrapper.querySelector('div');
      const input = root.firstElementChild;

      expect(root.hasAttribute('aria-hidden')).to.be.false;
      expect(input.hasAttribute('aria-hidden')).to.be.false;
    });

    it('should set aria-hidden on sibling elements on overlay open', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      const buttons = inner.querySelectorAll('button');
      expect(buttons[0].getAttribute('aria-hidden')).to.equal('true');
      expect(buttons[1].getAttribute('aria-hidden')).to.equal('true');
    });
  });
});
