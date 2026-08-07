import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, oneEvent, tabKeyDown } from '@vaadin/testing-helpers';
import '@vaadin/button';
import '@vaadin/grid';
import '@vaadin/radio-group';
import '@vaadin/text-field';
import '@vaadin/overlay/test/fixtures/mock-overlay.js';
import { getTabbableElements } from '@vaadin/a11y-base/src/focus-utils.js';
import { flushGrid } from '@vaadin/grid/test/helpers.js';

describe('overlay focus-trap', () => {
  let overlay, focusableElements;

  function getFocusedElementIndex() {
    return focusableElements.findIndex((element) => element.matches(':focus'));
  }

  describe('elements in light DOM', () => {
    beforeEach(async () => {
      overlay = fixtureSync(`
        <mock-overlay focus-trap>
          <vaadin-text-field></vaadin-text-field>
          <vaadin-radio-group>
            <vaadin-radio-button id="radioButton1" label="Button 1"></vaadin-radio-button>
            <vaadin-radio-button id="radioButton2" label="Button 2"></vaadin-radio-button>
            <vaadin-radio-button id="radioButton3" label="Button 3"></vaadin-radio-button>
          </vaadin-radio-group>
          <vaadin-button>tabindex 0</vaadin-button>
        </mock-overlay>
      `);
      await nextRender();
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getTabbableElements(overlay.$.overlay);
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should properly detect focusable elements inside the content', () => {
      expect(focusableElements.length).to.equal(6);
      expect(focusableElements[0]).to.equal(overlay.$.overlay);
      expect(focusableElements[1]).to.equal(overlay.querySelector('vaadin-text-field').focusElement);
      expect(focusableElements[2]).to.equal(overlay.querySelector('#radioButton1').focusElement);
      expect(focusableElements[3]).to.equal(overlay.querySelector('#radioButton2').focusElement);
      expect(focusableElements[4]).to.equal(overlay.querySelector('#radioButton3').focusElement);
      expect(focusableElements[5]).to.equal(overlay.querySelector('vaadin-button'));
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
  });

  describe('elements in shadow DOM', () => {
    beforeEach(async () => {
      overlay = fixtureSync(`
        <mock-overlay focus-trap>
          <div></div>
          <input />
        </mock-overlay>
      `);
      await nextRender();
      const div = overlay.querySelector('div');
      div.attachShadow({ mode: 'open' });
      div.shadowRoot.appendChild(document.createElement('vaadin-text-field'));
      div.shadowRoot.appendChild(document.createElement('button'));
    });

    it('should properly detect multiple focusable elements inside shadow DOM', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getTabbableElements(overlay.$.overlay);
      expect(focusableElements.length).to.equal(4);
      const div = overlay.querySelector('div');
      expect(focusableElements[1]).to.equal(div.shadowRoot.querySelector('input'));
      expect(focusableElements[2]).to.equal(div.shadowRoot.querySelector('button'));
    });

    it('should not focus the overlay part if the content is already focused', async () => {
      overlay.opened = true;
      // Needs to happen after opened and before focus-trap loop is executed
      focusableElements = getTabbableElements(overlay.$.overlay);
      focusableElements[1].focus();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(getFocusedElementIndex()).not.to.equal(0);
    });

    it('should focus first element with tabIndex=1', async () => {
      // It's an arguable behavior, probably overlay should be focused instead
      overlay.opened = true;
      focusableElements = getTabbableElements(overlay.$.overlay);
      focusableElements[1].tabIndex = 1;
      await oneEvent(overlay, 'vaadin-overlay-open');
      const idx = getFocusedElementIndex();
      expect(focusableElements[idx].tabIndex).to.equal(1);
    });

    it('should focus focusable elements in shadow DOM on Tab and Shift Tab', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      focusableElements = getTabbableElements(overlay.$.overlay);

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
  });

  describe('grid', () => {
    let grid, button;

    function getFirstHeaderCell() {
      return grid.$.header.children[0].children[0];
    }

    beforeEach(async () => {
      overlay = fixtureSync(`
        <mock-overlay focus-trap>
          <vaadin-grid style="width: 200px">
            <vaadin-grid-column path="name"></vaadin-grid-column>
          </vaadin-grid>
          <vaadin-button>Button</vaadin-button>
        </mock-overlay>
      `);
      [grid, button] = overlay.children;
      grid.items = [{ name: 'foo' }, { name: 'bar' }];
      flushGrid(grid);
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should correctly move focus on Tab when inside overlay', async () => {
      const headerCell = getFirstHeaderCell();
      headerCell.focus();

      // Move focus to grid body
      await sendKeys({ press: 'Tab' });

      // Move focus to the button
      await sendKeys({ press: 'Tab' });

      expect(document.activeElement).to.equal(button);
    });
  });
});
