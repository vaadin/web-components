import { expect } from '@vaadin/chai-plugins';
import { defineCE, fixtureSync } from '@vaadin/testing-helpers';
import {
  addValuesToAttribute,
  getAncestorRootNodes,
  getClosestElement,
  getFlattenedElements,
  hasNodeContent,
  isEmptyTextNode,
  removeValuesFromAttribute,
  setOrRemoveAttribute,
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
    let element, node;

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
      node = element.shadowRoot.querySelector('.child');
      const expected = element.shadowRoot.querySelector('.parent-2');
      expect(getClosestElement('.parent', node)).to.equal(expected);
    });

    it('should return the closest element matching the selector across the shadow root', () => {
      element = fixtureSync(`<div class="wrapper"><${tag}></${tag}></div>`);

      node = element.querySelector(tag).shadowRoot;
      expect(getClosestElement('.wrapper', node)).to.equal(element);

      node = element.querySelector(tag).shadowRoot.querySelector('.parent');
      expect(getClosestElement('.wrapper', node)).to.equal(element);
    });

    it('should return null when no closest element is found', () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      node = element.shadowRoot.querySelector('.child');
      expect(getClosestElement('.not-existing-class', node)).to.be.null;
    });

    it('should return the passed element if it matches the selector', () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      node = element.shadowRoot.querySelector('.child');
      expect(getClosestElement('.child', node)).to.equal(node);
    });
  });

  describe('addValuesToAttribute', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
    });

    it('should add a single value to an attribute', () => {
      addValuesToAttribute(element, 'aria-labelledby', 'label-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id');

      addValuesToAttribute(element, 'aria-labelledby', 'error-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id error-id');
    });

    it('should add a string of space-delimited values to an attribute', () => {
      addValuesToAttribute(element, 'aria-labelledby', 'label-id error-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id error-id');
    });

    it('should add an array of values to an attribute', () => {
      addValuesToAttribute(element, 'aria-labelledby', ['label-id', 'error-id helper-id']);
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id error-id helper-id');
    });

    it('should not duplicate values in the attribute', () => {
      addValuesToAttribute(element, 'aria-labelledby', ['label-id', 'error-id']);
      addValuesToAttribute(element, 'aria-labelledby', 'label-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id error-id');
    });

    it('should not set the attribute when there are no values to add', () => {
      addValuesToAttribute(element, 'aria-labelledby', []);
      expect(element.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should ignore empty tokens produced by extra whitespace', () => {
      addValuesToAttribute(element, 'aria-labelledby', '  label-id   error-id  ');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id error-id');
    });
  });

  describe('removeValuesFromAttribute', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
      element.setAttribute('aria-labelledby', 'label-id error-id helper-id');
    });

    it('should remove a single value from an attribute', () => {
      removeValuesFromAttribute(element, 'aria-labelledby', 'error-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id helper-id');
    });

    it('should remove a string of space-delimited values from an attribute', () => {
      removeValuesFromAttribute(element, 'aria-labelledby', 'error-id helper-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id');
    });

    it('should remove an array of values from an attribute', () => {
      removeValuesFromAttribute(element, 'aria-labelledby', ['error-id', 'helper-id']);
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id');
    });

    it('should remove the attribute when no values remain', () => {
      removeValuesFromAttribute(element, 'aria-labelledby', ['label-id', 'error-id helper-id']);
      expect(element.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should remove the attribute when only whitespace remains', () => {
      element.setAttribute('aria-labelledby', ' label-id  error-id ');
      removeValuesFromAttribute(element, 'aria-labelledby', ['label-id', 'error-id']);
      expect(element.hasAttribute('aria-labelledby')).to.be.false;
    });
  });

  describe('setOrRemoveAttribute', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
    });

    it('should toggle the attribute on setting and clearing the value', () => {
      setOrRemoveAttribute(element, 'theme', 'small');
      expect(element.getAttribute('theme')).to.equal('small');

      setOrRemoveAttribute(element, 'theme', null);
      expect(element.hasAttribute('theme')).to.be.false;
    });

    it('should set the attribute to a stringified value', () => {
      setOrRemoveAttribute(element, 'aria-modal', true);
      expect(element.getAttribute('aria-modal')).to.equal('true');
    });

    it('should remove the attribute when the value is undefined', () => {
      element.setAttribute('theme', 'small');
      setOrRemoveAttribute(element, 'theme', undefined);
      expect(element.hasAttribute('theme')).to.be.false;
    });

    it('should remove the attribute when the value is false', () => {
      element.setAttribute('theme', 'small');
      setOrRemoveAttribute(element, 'theme', false);
      expect(element.hasAttribute('theme')).to.be.false;
    });

    it('should remove the attribute when the value is an empty string', () => {
      element.setAttribute('theme', 'small');
      setOrRemoveAttribute(element, 'theme', '');
      expect(element.hasAttribute('theme')).to.be.false;
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

  describe('hasNodeContent', () => {
    it('should return false for a nullish node', () => {
      expect(hasNodeContent(null)).to.be.false;
      expect(hasNodeContent(undefined)).to.be.false;
    });

    it('should return false for an element with no children and no text', () => {
      const element = fixtureSync('<div></div>');
      expect(hasNodeContent(element)).to.be.false;
    });

    it('should return false for an element with whitespace text only', () => {
      const element = fixtureSync('<div> </div>');
      expect(hasNodeContent(element)).to.be.false;
    });

    it('should return true for an element with non-empty text', () => {
      const element = fixtureSync('<div>content</div>');
      expect(hasNodeContent(element)).to.be.true;
    });

    it('should return true for an element with element children', () => {
      const element = fixtureSync('<div><span></span></div>');
      expect(hasNodeContent(element)).to.be.true;
    });

    it('should return true for an empty defined custom element', () => {
      // A defined custom element may render content in its shadow root.
      const tag = defineCE(class extends HTMLElement {});
      const element = fixtureSync(`<${tag}></${tag}>`);
      expect(hasNodeContent(element)).to.be.true;
    });

    it('should return false for an empty undefined custom element', () => {
      const element = fixtureSync('<x-undefined-element></x-undefined-element>');
      expect(hasNodeContent(element)).to.be.false;
    });

    it('should return true for a text node with non-empty text', () => {
      expect(hasNodeContent(document.createTextNode('content'))).to.be.true;
    });

    it('should return false for a text node with whitespace text only', () => {
      expect(hasNodeContent(document.createTextNode(' '))).to.be.false;
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
