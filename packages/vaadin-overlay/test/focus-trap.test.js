import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, oneEvent, tabKeyDown } from '@vaadin/testing-helpers';
import '@vaadin/button/vaadin-button.js';
import '@vaadin/text-field/vaadin-text-field.js';
import '@vaadin/radio-group/vaadin-radio-group.js';
import '@vaadin/radio-group/vaadin-radio-button.js';
import '../vaadin-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { getFocusableElements, isElementFocused } from '@vaadin/component-base/src/focus-utils.js';

const shadowTemplate = document.createElement('template');
shadowTemplate.innerHTML = `
  <input type="text" id="text">
  <vaadin-text-field></vaadin-text-field>
`;

customElements.define(
  'container-with-shadow',
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(document.importNode(shadowTemplate.content, true));
    }
  },
);

customElements.define(
  'overlay-components-wrapper',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay id="defaultOverlay" focus-trap>
          <template>
            overlay-content
            <button>tabindex 0</button>
            <button tabindex="-1">tabindex -1</button>
            <select tabindex="2">
              <option>tabindex 2</option>
            </select>
            <vaadin-text-field></vaadin-text-field>
            <textarea tabindex="1">tabindex 1</textarea>
            <input type="text" id="text" value="tabindex 0" />
            <vaadin-radio-group>
              <vaadin-radio-button id="radioButton1" label="Button 1"></vaadin-radio-button>
              <vaadin-radio-button id="radioButton2" label="Button 2"></vaadin-radio-button>
              <vaadin-radio-button id="radioButton3" label="Button 3"></vaadin-radio-button>
            </vaadin-radio-group>
            <vaadin-button>tabindex 0</vaadin-button>
          </template>
        </vaadin-overlay>
        <vaadin-overlay id="shadowOverlay" focus-trap>
          <template>
            <container-with-shadow></container-with-shadow>
            <input type="text" id="text" />
          </template>
        </vaadin-overlay>
        <vaadin-overlay id="emptyOverlay" focus-trap>
          <template></template>
        </vaadin-overlay>
      `;
    }
  },
);

customElements.define(
  'nested-overlay-wrapper',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay id="outer" focus-trap>
          <template>
            <button>Button</button>
            <vaadin-overlay id="nested">
              <template>Inner content</template>
            </vaadin-overlay>
          </template>
        </vaadin-overlay>
      `;
    }
  },
);

describe('focus-trap', () => {
  let overlay, parent, overlayPart, focusableElements;

  function getFocusedElementIndex() {
    return focusableElements.findIndex(isElementFocused);
  }

  describe('in a component scope', () => {
    beforeEach(async () => {
      parent = fixtureSync('<overlay-components-wrapper></overlay-components-wrapper>');
      await nextRender();
      overlay = parent.$.defaultOverlay;
      overlayPart = overlay.$.overlay;
      focusableElements = getFocusableElements(overlay.$.overlay);
      window.focus();
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should not focus the overlay when focusTrap = false', async () => {
      overlay.focusTrap = false;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(getFocusedElementIndex()).to.be.eql(-1);
    });

    it('should properly detect focusable elements inside the content', () => {
      expect(focusableElements.length).to.equal(10);
      expect(focusableElements[0]).to.eql(overlay.content.querySelector('textarea'));
      expect(focusableElements[1]).to.eql(overlay.content.querySelector('select'));
      expect(focusableElements[2]).to.eql(overlay.$.overlay);
      expect(focusableElements[3]).to.eql(overlay.content.querySelector('button'));
      expect(focusableElements[4]).to.eql(overlay.content.querySelector('vaadin-text-field').focusElement);
      expect(focusableElements[5]).to.eql(overlay.content.querySelector('#text'));
      expect(focusableElements[6]).to.eql(overlay.content.querySelector('#radioButton1').focusElement);
      expect(focusableElements[7]).to.eql(overlay.content.querySelector('#radioButton2').focusElement);
      expect(focusableElements[8]).to.eql(overlay.content.querySelector('#radioButton3').focusElement);
      expect(focusableElements[9]).to.eql(overlay.content.querySelector('vaadin-button'));
    });

    it('should focus focusable elements inside the content when focusTrap = true', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      // TAB
      for (let i = 0; i < focusableElements.length; i++) {
        // Emulating control-state-mixin moving focus
        if (focusableElements.filter(isElementFocused).length > 1) {
          i += 1;
        }

        const focusedIndex = getFocusedElementIndex();
        expect(focusedIndex).to.equal(i);
        tabKeyDown(focusableElements[focusedIndex]);
      }
      expect(getFocusedElementIndex()).to.eql(0);

      // SHIFT+TAB
      tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);
      for (let i = focusableElements.length - 1; i >= 0; i--) {
        expect(getFocusedElementIndex()).to.eql(i);

        // Emulating control-state-mixin moving focus
        if (focusableElements.filter(isElementFocused).length > 1) {
          i -= 1;
        }

        tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);
      }
      expect(getFocusedElementIndex()).to.eql(focusableElements.length - 1);
    });

    it('should update focus sequence when focusing a random element', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(getFocusedElementIndex()).to.eql(0);

      tabKeyDown(document.body);
      expect(getFocusedElementIndex()).to.eql(1);

      focusableElements[0].focus();
      tabKeyDown(document.body);
      expect(getFocusedElementIndex()).to.eql(1);
    });

    it('should not throw using Shift Tab on elements with shadow root', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      const button = overlay.content.querySelector('vaadin-button');
      button.focus();
      button.blur();

      tabKeyDown(document.body, ['shift']);
    });

    describe('shadow content', () => {
      beforeEach(() => {
        overlay = parent.$.shadowOverlay;
        focusableElements = getFocusableElements(overlay.$.overlay);
      });

      it('should properly detect multiple focusables in web component shadowRoots', () => {
        expect(focusableElements.length).to.eql(4);
        expect(focusableElements[1]).to.eql(
          overlay.content.querySelector('container-with-shadow').shadowRoot.getElementById('text'),
        );
      });

      it('should focus the overlay part on open', async () => {
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(getFocusedElementIndex()).to.eql(0);
      });

      it('should not focus the overlay part if the content is already focused', async () => {
        overlay.opened = true;
        // Needs to happen after opened and before focus-trap loop is executed
        focusableElements[1].focus();
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(getFocusedElementIndex()).not.to.eql(0);
      });

      it('should focus first element with tabIndex=1', async () => {
        // It's an arguable behaviour, probably overlay should be focused instead
        focusableElements[1].tabIndex = 1;
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        const idx = getFocusedElementIndex();
        expect(focusableElements[idx].tabIndex).to.eql(1);
      });

      it('`_cycleTab` should visit elements inside shadow content on keyboard `tab` actions', async () => {
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');

        // TAB
        for (let i = 0; i < focusableElements.length; i++) {
          // Emulating control-state-mixin moving focus
          if (focusableElements.filter(isElementFocused).length > 1) {
            i += 1;
          }

          const focusedIndex = getFocusedElementIndex();
          expect(focusedIndex).to.equal(i);
          tabKeyDown(focusableElements[focusedIndex]);
        }
        expect(getFocusedElementIndex()).to.eql(0);

        // SHIFT+TAB
        tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);
        for (let i = focusableElements.length - 1; i >= 0; i--) {
          expect(getFocusedElementIndex()).to.eql(i);

          // Emulating control-state-mixin moving focus
          if (focusableElements.filter(isElementFocused).length > 1) {
            i -= 1;
          }

          tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);
        }
        expect(getFocusedElementIndex()).to.eql(focusableElements.length - 1);
      });
    });

    describe('empty content', () => {
      beforeEach(() => {
        overlay = parent.$.emptyOverlay;
        overlayPart = overlay.$.overlay;
        overlay._observer.flush();
        focusableElements = getFocusableElements(overlay.$.overlay);
      });

      it('should focus the overlayPart when focusTrap = true', async () => {
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(focusableElements[0]).to.be.eql(overlayPart);
        expect(getFocusedElementIndex()).to.eql(0);
      });
    });
  });

  describe('in the global scope', () => {
    beforeEach(async () => {
      parent = fixtureSync(`
        <div>
          <vaadin-overlay focus-trap>
            <template>
              overlay-content
              <button>tabindex 0</button>
              <button tabindex="-1">tabindex -1</button>
              <select tabindex="2"><option>tabindex 2</option></select>
              <vaadin-text-field></vaadin-text-field>
              <textarea tabindex="1">tabindex 1</textarea>
              <input type="text" id="text" value="tabindex 0">
              <vaadin-radio-group>
                <vaadin-radio-button id="radioButton1" label="Button 1"></vaadin-radio-button>
                <vaadin-radio-button id="radioButton2" label="Button 2"></vaadin-radio-button>
                <vaadin-radio-button id="radioButton3" label="Button 3"></vaadin-radio-button>
              </vaadin-radio-group>
              <vaadin-button>tabindex 0</vaadin-button>
            </template>
          </vaadin-overlay>
        </div>
      `);
      await nextRender();
      overlay = parent.firstElementChild;
      overlayPart = overlay.$.overlay;
      focusableElements = getFocusableElements(overlay.$.overlay);
      window.focus();
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should not focus the overlay when focusTrap = false', async () => {
      overlay.focusTrap = false;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(getFocusedElementIndex()).to.be.eql(-1);
    });

    it('should properly detect focusable elements inside the content', () => {
      expect(focusableElements.length).to.equal(10);
      expect(focusableElements[0]).to.eql(overlay.content.querySelector('textarea'));
      expect(focusableElements[1]).to.eql(overlay.content.querySelector('select'));
      expect(focusableElements[2]).to.eql(overlay.$.overlay);
      expect(focusableElements[3]).to.eql(overlay.content.querySelector('button'));
      expect(focusableElements[4]).to.eql(overlay.content.querySelector('vaadin-text-field').focusElement);
      expect(focusableElements[5]).to.eql(overlay.content.querySelector('#text'));
      expect(focusableElements[6]).to.eql(overlay.content.querySelector('#radioButton1').focusElement);
      expect(focusableElements[7]).to.eql(overlay.content.querySelector('#radioButton2').focusElement);
      expect(focusableElements[8]).to.eql(overlay.content.querySelector('#radioButton3').focusElement);
      expect(focusableElements[9]).to.eql(overlay.content.querySelector('vaadin-button'));
    });

    it('should focus focusable elements inside the content when focusTrap = true', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      // TAB
      for (let i = 0; i < focusableElements.length; i++) {
        // Emulating control-state-mixin moving focus
        if (focusableElements.filter(isElementFocused).length > 1) {
          i += 1;
        }

        expect(getFocusedElementIndex()).to.eql(i);
        tabKeyDown(focusableElements[getFocusedElementIndex()]);
      }
      expect(getFocusedElementIndex()).to.eql(0);

      // SHIFT+TAB
      tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);
      for (let i = focusableElements.length - 1; i >= 0; i--) {
        expect(getFocusedElementIndex()).to.eql(i);

        // Emulating control-state-mixin moving focus
        if (focusableElements.filter(isElementFocused).length > 1) {
          i -= 1;
        }

        tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);
      }
      expect(getFocusedElementIndex()).to.eql(focusableElements.length - 1);
    });

    it('should update focus sequence when focusing a random element', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(getFocusedElementIndex()).to.eql(0);

      tabKeyDown(document.body);
      expect(getFocusedElementIndex()).to.eql(1);

      focusableElements[0].focus();
      tabKeyDown(document.body);
      expect(getFocusedElementIndex()).to.eql(1);
    });

    it('should not throw using Shift Tab on elements with shadow root', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      const button = overlay.content.querySelector('vaadin-button');
      button.focus();
      button.blur();

      tabKeyDown(document.body, ['shift']);
    });

    describe('shadow content', () => {
      beforeEach(() => {
        overlay = fixtureSync(`
          <vaadin-overlay focus-trap>
            <template>
              <container-with-shadow></container-with-shadow>
              <svg></svg>
              <input type="text" id="text">
            </template>
          </vaadin-overlay>
        `);
        focusableElements = getFocusableElements(overlay.$.overlay);
      });

      it('should properly detect multiple focusables in web component shadowRoots', () => {
        expect(focusableElements.length).to.eql(4);
        expect(focusableElements[1]).to.eql(
          overlay.content.querySelector('container-with-shadow').shadowRoot.getElementById('text'),
        );
      });

      it('should focus the overlay part on open', async () => {
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(getFocusedElementIndex()).to.eql(0);
      });

      it('should not focus the overlay part if the content is already focused', async () => {
        overlay.opened = true;
        // Needs to happen after opened and before focus-trap loop is executed
        focusableElements[1].focus();
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(getFocusedElementIndex()).not.to.eql(0);
      });

      it('should focus first element with tabIndex=1', async () => {
        // It's an arguable behaviour, probably overlay should be focused instead
        focusableElements[1].tabIndex = 1;
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        const idx = getFocusedElementIndex();
        expect(focusableElements[idx].tabIndex).to.eql(1);
      });

      it('`_cycleTab` should visit elements inside shadow content on keyboard `tab` actions', async () => {
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');

        // TAB
        for (let i = 0; i < focusableElements.length; i++) {
          // Emulating control-state-mixin moving focus
          if (focusableElements.filter(isElementFocused).length > 1) {
            i += 1;
          }

          expect(getFocusedElementIndex()).to.eql(i);
          tabKeyDown(focusableElements[getFocusedElementIndex()]);
        }
        expect(getFocusedElementIndex()).to.eql(0);

        // SHIFT+TAB
        tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);
        for (let i = focusableElements.length - 1; i >= 0; i--) {
          expect(getFocusedElementIndex()).to.eql(i);

          // Emulating control-state-mixin moving focus
          if (focusableElements.filter(isElementFocused).length > 1) {
            i -= 1;
          }

          tabKeyDown(focusableElements[getFocusedElementIndex()], ['shift']);
        }
        expect(getFocusedElementIndex()).to.eql(focusableElements.length - 1);
      });
    });

    describe('empty content', () => {
      beforeEach(() => {
        parent = fixtureSync(`
          <div>
            <vaadin-overlay focus-trap>
              <template>
              </template>
            </vaadin-overlay>
          </div>
        `);
        overlay = parent.firstElementChild;
        overlayPart = overlay.$.overlay;
        overlay._observer.flush();
        focusableElements = getFocusableElements(overlay.$.overlay);
      });

      it('should focus the overlayPart when focusTrap = true', async () => {
        overlay.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
        expect(focusableElements[0]).to.be.eql(overlayPart);
        expect(getFocusedElementIndex()).to.eql(0);
      });
    });
  });

  describe('nested overlay', () => {
    let nested;

    beforeEach(async () => {
      parent = fixtureSync('<nested-overlay-wrapper></nested-overlay-wrapper>');
      overlay = parent.$.outer;
      overlay.opened = true;
      focusableElements = getFocusableElements(overlay.$.overlay);
      await nextRender();
      nested = overlay.content.querySelector('#nested');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should not release focus when closing nested overlay without focus-trap', async () => {
      nested.opened = true;
      await nextRender();
      nested.opened = false;

      const button = overlay.content.querySelector('button');
      button.focus();
      tabKeyDown(button);

      expect(getFocusedElementIndex()).to.equal(0);
    });
  });
});
