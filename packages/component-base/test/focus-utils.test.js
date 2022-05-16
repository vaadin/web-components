import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { getFocusableElements, isElementFocusable, isElementFocused, isElementHidden } from '../src/focus-utils.js';

describe('focus-utils', () => {
  describe('isElementHidden', () => {
    let element;

    beforeEach(() => {
      element = fixtureSync(`
        <div class="parent">
          <div class="child"></div>
        </div>
      `);
    });

    it('should return true for children of an element hidden with display: none;', () => {
      element.style.display = 'none';
      expect(isElementHidden(element.querySelector('.child'))).to.be.true;
    });

    it('should return true for children of an element hidden with visibility: hidden;', () => {
      element.style.visibility = 'hidden';
      expect(isElementHidden(element.querySelector('.child'))).to.be.true;
    });

    it('should return true for elements hidden with display: none', () => {
      element.style.display = 'none';
      expect(isElementHidden(element)).to.be.true;
    });

    it('should return true for elements hidden with visibility: hidden', () => {
      element.style.visibility = 'hidden';
      expect(isElementHidden(element)).to.be.true;
    });

    it('should return false for visible elements', () => {
      expect(isElementHidden(element)).to.be.false;
    });
  });

  describe('isElementFocusable', () => {
    ['input', 'select', 'textarea', 'button', 'object'].forEach((tagName) => {
      it(`should return true for <${tagName}> by default`, () => {
        const element = document.createElement(tagName);
        expect(isElementFocusable(element)).to.be.true;
      });

      it(`should return false for <${tagName}> with [disabled]`, () => {
        const element = document.createElement(tagName);
        element.setAttribute('disabled', '');
        expect(isElementFocusable(element)).to.be.false;
      });

      it(`should return false for <${tagName}> with [tabindex] = -1`, () => {
        const element = document.createElement(tagName);
        element.setAttribute('tabindex', '-1');
        expect(isElementFocusable(element)).to.be.false;
      });
    });

    ['a', 'area'].forEach((tagName) => {
      it(`should return false for <${tagName}> by default`, () => {
        const element = document.createElement(tagName);
        expect(isElementFocusable(element)).to.be.false;
      });

      it(`should return true for <${tagName}> with [href]`, () => {
        const element = document.createElement(tagName);
        element.href = '#';
        expect(isElementFocusable(element)).to.be.true;
      });

      it(`should return false for <${tagName}> with [href] and [tabindex] = -1`, () => {
        const element = document.createElement(tagName);
        element.href = '#';
        element.setAttribute('tabindex', '-1');
        expect(isElementFocusable(element)).to.be.false;
      });
    });

    it('should return true for <iframe> by default', () => {
      const element = document.createElement('iframe');
      expect(isElementFocusable(element)).to.be.true;
    });

    it('should return false for <iframe> with [tabindex] = -1', () => {
      const element = document.createElement('iframe');
      element.setAttribute('tabindex', '-1');
      expect(isElementFocusable(element)).to.be.false;
    });

    it('should return false for <div> by default', () => {
      const element = document.createElement('div');
      expect(isElementFocusable(element)).to.be.false;
    });

    it('should return true for <div> with [tabindex] >= 0', () => {
      const element = document.createElement('div');
      element.setAttribute('tabindex', '0');
      expect(isElementFocusable(element)).to.be.true;
    });

    it('should return true for <div> with [contenteditable]', () => {
      const element = document.createElement('div');
      element.setAttribute('contenteditable', '');
      expect(isElementFocusable(element)).to.be.true;
    });

    it('should return false for <div> with [contenteditable] and [tabindex] = -1', () => {
      const element = document.createElement('div');
      element.setAttribute('contenteditable', '');
      element.setAttribute('tabindex', '-1');
      expect(isElementFocusable(element)).to.be.false;
    });
  });

  describe('getFocusableElements', () => {
    customElements.define(
      'custom-element',
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
          this.shadowRoot.innerHTML = `
            <div id="custom-element-1" tabindex="0"></div>
            <div id="custom-element-2" tabindex="-1"></div>
            <slot>
              <div id="custom-element-3" tabindex="3"></div>
            </slot>
          `;
        }
      },
    );

    it('should return focusable elements in the tab order', () => {
      const root = fixtureSync(`
        <div id="root" tabindex="0">
          text node
          <button id="element-1"></button>
          <button id="element-2" tabindex="-1"></button>
          <select id="element-3" tabindex="2">
            <option></option>
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
        'custom-element-1',
      ]);
    });

    it('should return focusable elements even if an ancestor has display: none', () => {
      const ancestor = fixtureSync(`
        <div id="ancestor" style="display: none">
          <div id="root" tabindex="0"></div>
        </div>
      `);

      const focusableElements = getFocusableElements(ancestor.querySelector('#root'));
      expect(focusableElements).to.have.lengthOf(1);
      expect(focusableElements[0].id).to.equal('root');
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
