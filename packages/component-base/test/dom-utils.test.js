import { expect } from '@vaadin/chai-plugins';
import { defineCE, fixtureSync } from '@vaadin/testing-helpers';
import {
  addValueToAttribute,
  getAncestorRootNodes,
  getClosestElement,
  getFlattenedElements,
  isEmptyTextNode,
  removeValueFromAttribute,
} from '../src/dom-utils.js';

describe('dom-utils', () => {
  describe('getAncestorRootNodes', () => {
    let element, child;

    const tag = defineCE(
      class ShadowElement extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
          this.shadowRoot.innerHTML = `
          <div class="root">
            <slot></slot>
          </div>
        `;
        }
      },
    );

    beforeEach(() => {
      element = fixtureSync(`
        <${tag}>
          <div class="child"></div>
        </${tag}>
      `);
      child = element.querySelector('.child');
    });

    it('should return an array of the ancestor root nodes for a node', () => {
      const nodes = getAncestorRootNodes(child);
      expect(nodes).to.have.lengthOf(2);
      expect(nodes[0]).to.equal(element.shadowRoot);
      expect(nodes[1]).to.equal(document);
    });
  });

  describe('getClosestElement', () => {
    let element;

    const tag = defineCE(
      class ShadowElement extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
          this.shadowRoot.innerHTML = `
            <div class="parent parent-1">
              <div class="parent parent-2">
                <div class="child"></div>
              </div>
            </div>
          `;
        }
      },
    );

    it('should return the closest element matching the selector within the shadow root', () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      const node = element.shadowRoot.querySelector('.child');
      const expected = element.shadowRoot.querySelector('.parent-2');
      expect(getClosestElement('.parent', node)).to.equal(expected);
    });

    it('should return the closest element matching the selector across the shadow root', () => {
      element = fixtureSync(`<div class="wrapper"><${tag}></${tag}></div>`);
      const node = element.querySelector(tag).shadowRoot.querySelector('.parent');
      expect(getClosestElement('.wrapper', node)).to.equal(element);
    });

    it('should return null when no closest element is found', () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      const node = element.shadowRoot.querySelector('.child');
      expect(getClosestElement('.not-existing-class', node)).to.be.null;
    });

    it('should return the passed element if it matches the selector', () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      const node = element.shadowRoot.querySelector('.child');
      expect(getClosestElement('.child', node)).to.equal(node);
    });
  });

  describe('addValueToAttribute', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
    });

    it('should add a value to an attribute', () => {
      addValueToAttribute(element, 'aria-labelledby', 'label-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id');

      addValueToAttribute(element, 'aria-labelledby', 'error-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id error-id');
    });

    it('should not duplicate values in the attribute', () => {
      addValueToAttribute(element, 'aria-labelledby', 'label-id');
      addValueToAttribute(element, 'aria-labelledby', 'label-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id');
    });
  });

  describe('removeValueFromAttribute', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
      element.setAttribute('aria-labelledby', 'label-id error-id');
    });

    it('should remove a value from an attribute', () => {
      removeValueFromAttribute(element, 'aria-labelledby', 'error-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id');

      removeValueFromAttribute(element, 'aria-labelledby', 'label-id');
      expect(element.hasAttribute('aria-labelledby')).to.be.false;
    });
  });

  describe('isEmptyTextNode', () => {
    let node;

    beforeEach(() => {
      node = document.createTextNode('');
    });

    it('should return true when node has empty text content', () => {
      expect(isEmptyTextNode(node)).to.be.true;
    });

    it('should return true when node has whitespace text content', () => {
      node.textContent = '  ';
      expect(isEmptyTextNode(node)).to.be.true;
    });

    it('should return false when node has non-empty text content', () => {
      node.textContent = '0';
      expect(isEmptyTextNode(node)).to.be.false;
    });
  });

  describe('getFlattenedElements', () => {
    let foo, bar, baz;

    beforeEach(() => {
      foo = document.createElement('div');
      foo.attachShadow({ mode: 'open' });
      foo.shadowRoot.innerHTML = '<slot></slot>';

      bar = document.createElement('div');
      bar.attachShadow({ mode: 'open' });
      bar.shadowRoot.innerHTML = '<span>A</span><slot></slot><span>B</span>';

      baz = document.createElement('span');
      baz.textContent = 'C';

      document.body.appendChild(foo);
      bar.appendChild(baz);
      foo.appendChild(bar);
    });

    afterEach(() => {
      document.body.removeChild(foo);
    });

    it('should return flattened elements for the element itself', () => {
      expect(getFlattenedElements(foo)).to.eql([foo, bar, baz]);
      expect(getFlattenedElements(bar)).to.eql([bar, baz]);
    });

    it('should return flatted elements for the parent slot element', () => {
      const slot = foo.shadowRoot.querySelector('slot');
      expect(getFlattenedElements(slot)).to.eql([bar, baz]);
    });

    it('should return flatted elements for the child slot element', () => {
      const slot = bar.shadowRoot.querySelector('slot');
      expect(getFlattenedElements(slot)).to.eql([baz]);
    });
  });
});
