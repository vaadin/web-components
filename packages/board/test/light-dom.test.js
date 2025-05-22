import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-board-row.js';

describe('light DOM children', () => {
  let row;

  describe('adding', () => {
    beforeEach(() => {
      row = fixtureSync(`
        <vaadin-board-row style="width: 1200px;">
          <div id="first">top B</div>
          <div>top C</div>
          <div>top D</div>
        </vaadin-board-row>
      `);
    });

    it('should trigger resize when element is added', async () => {
      const firstItem = row.querySelector('#first');
      const addedItem = document.createElement('div');
      addedItem.textContent = 'top A';
      row.insertBefore(addedItem, firstItem);
      await nextFrame();
      const rowRect = row.getBoundingClientRect();
      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();
        expect(rowRect.top).to.closeTo(rect.top, 1);
        expect(rect.left).to.be.closeTo((i * rowRect.width) / 4 + rowRect.left, 1);
      }
    });
  });

  describe('removing', () => {
    beforeEach(() => {
      row = fixtureSync(`
        <vaadin-board-row style="width: 1200px;">
          <div id="first">top A</div>
          <div>top B</div>
          <div>top C</div>
          <div>top D</div>
        </vaadin-board-row>
      `);
    });

    it('should trigger resize when element is removed', async () => {
      const firstItem = row.querySelector('#first');
      const secondItem = firstItem.nextElementSibling;
      row.removeChild(firstItem);
      row.removeChild(secondItem);
      await nextFrame();
      const rowRect = row.getBoundingClientRect();
      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();
        expect(rowRect.top).to.closeTo(rect.top, 1);
        expect(rect.left).to.be.closeTo(((i % 2) * rowRect.width) / 2 + rowRect.left, 1);
      }
    });
  });
});
