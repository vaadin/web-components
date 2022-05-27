import { expect } from '@esm-bundle/chai';
import { defineCE, fixtureSync } from '@vaadin/testing-helpers';
import { getAncestorRootNodes } from '../src/dom-utils.js';

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
});
