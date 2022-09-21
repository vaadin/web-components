import { expect } from '@esm-bundle/chai';
import { defineCE, fixtureSync } from '@vaadin/testing-helpers';
import {
  addValueToAttribute,
  getAncestorRootNodes,
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
});
