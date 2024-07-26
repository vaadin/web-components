import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { html, render } from 'lit';

describe('lit', () => {
  describe('renderer', () => {
    let list;

    beforeEach(async () => {
      list = fixtureSync(`<vaadin-virtual-list></vaadin-virtual-list>`);
      await nextFrame();

      const size = 100;

      list.items = new Array(size).fill().map((_, i) => {
        return { value: `value-${i}` };
      });

      list.renderer = (root, _, { index }) => {
        render(html`value-${index}`, root);
      };
    });

    it('should render the content', () => {
      expect(list.children[0].textContent.trim()).to.equal('value-0');
    });

    it('should render new content after assigning a new renderer', () => {
      list.renderer = (root, _, { index }) => {
        render(html`new-${index}`, root);
      };

      expect(list.children[0].textContent.trim()).to.equal('new-0');
    });
  });
});
