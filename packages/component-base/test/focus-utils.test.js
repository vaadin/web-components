import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { getFocusableElements, isElementFocused } from '../src/focus-utils.js';

describe('focus-utils', () => {
  describe('getFocusableElements', () => {
    let root;

    customElements.define(
      'custom-element',
      class extends PolymerElement {
        static get template() {
          return html`
            <div id="custom-element-1" tabindex="0"></div>
            <div id="custom-element-2" tabindex="-1"></div>
            <slot>
              <div id="custom-element-3" tabindex="3"></div>
            </slot>
          `;
        }
      }
    );

    beforeEach(() => {
      root = fixtureSync(`
        <div id="root" tabindex="0">
          content
          <button id="element-1"></button>
          <button id="element-2" tabindex="-1"></button>
          <select id="element-3" tabindex="2">
            <option>tabindex 2</option>
          </select>
          <textarea id="element-4" tabindex="1"></textarea>
          <input type="text" id="element-5" />
          <input type="text" id="element-6" style="display: none;" />
          <input type="text" id="element-7" style="visibility: hidden;" />
          <input type="radio" id="element-8" />
          <input type="checkbox" id="element-9" />
          <custom-element></custom-element>
        </div>
      `);
    });

    it('should return focusable elements in the tab order', () => {
      const focusableElements = getFocusableElements(root);
      expect(focusableElements.map((element) => element.id)).to.deep.equal([
        'element-4',
        'element-3',
        'custom-element-3',
        'root',
        'element-1',
        'element-5',
        'element-8',
        'element-9',
        'custom-element-1'
      ]);
    });
  });

  describe('isElementFocused', () => {
    let input;

    beforeEach(() => {
      input = fixtureSync(`<input>`);
    });

    it('should return true for a focused element', () => {
      input.focus();
      expect(isElementFocused(input)).to.be.true;
    });

    it('should return false for a not focused element', () => {
      input.focus();
      expect(isElementFocused(document.body)).to.be.false;
    });
  });
});
