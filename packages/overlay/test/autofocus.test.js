import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-overlay.js';
import { getDeepActiveElement, isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';

describe('autofocus', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<vaadin-overlay autofocus></vaadin-overlay>');
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

  it('should focus the first tabbable element when opened', async () => {
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
