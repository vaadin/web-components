import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-board-row.js';

describe('board-cols', () => {
  let row;

  describe('desktop 1 colspan item', () => {
    beforeEach(() => {
      row = fixtureSync(`
        <vaadin-board-row style="width: 1200px;">
          <div board-cols="2">top A</div>
          <div>top B</div>
          <div>top C</div>
        </vaadin-board-row>
      `);
    });

    it('should make item with colspan 2 take 50% width', () => {
      const rowRect = row.getBoundingClientRect();
      const expectedLeftOffset = [0, Math.floor((1 / 2) * rowRect.width), Math.floor((3 / 4) * rowRect.width)];

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();

        expect(rect.top).to.equal(rowRect.top);
        expect(rect.left).to.be.closeTo(rowRect.left + expectedLeftOffset[i], 1);
      }
    });
  });

  describe('desktop 2 colspan items', () => {
    beforeEach(() => {
      row = fixtureSync(`
        <vaadin-board-row style="width: 1200px;">
          <div board-cols="2">low A</div>
          <div board-cols="1">low B / A</div>
        </vaadin-board-row>
      `);
    });

    it('should make items with colspan take 66% and 33% width', () => {
      const rowRect = row.getBoundingClientRect();
      const expectedLeftOffset = [0, Math.floor((2 / 3) * rowRect.width)];

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();

        expect(rect.top).to.equal(rowRect.top);
        expect(rect.left).to.be.closeTo(rowRect.left + expectedLeftOffset[i], 1);
      }
    });
  });

  describe('incorrect colspan', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');

      row = fixtureSync(`
        <vaadin-board-row style="width: 1200px;">
          <div board-cols="2">top A</div>
          <div board-cols="2">top B</div>
          <div board-cols="3">top C</div>
        </vaadin-board-row>
      `);
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should ignore incorrect board-cols', () => {
      const rowRect = row.getBoundingClientRect();
      const expectedLeftOffset = [0, Math.floor((1 / 3) * rowRect.width), Math.floor((2 / 3) * rowRect.width)];

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();

        expect(rect.top).to.equal(rowRect.top);
        expect(rect.left).to.be.closeTo(rowRect.left + expectedLeftOffset[i], 1);
      }
    });

    it('should warn about incorrect board-cols', async () => {
      await aTimeout(0);
      expect(console.warn.called).to.be.true;
    });
  });

  describe('extra item', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');

      row = fixtureSync(`
        <vaadin-board-row style="width: 1200px;">
          <div>top A</div>
          <div>top B</div>
          <div>top C</div>
          <div>top D</div>
          <div>top E</div>
        </vaadin-board-row>
      `);
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn about incorrect children count', async () => {
      await aTimeout(0);
      expect(console.warn.called).to.be.true;
    });

    it('should remove extra children from the DOM', () => {
      const children = row.querySelectorAll('div');
      expect(children.length).to.equal(4);
    });
  });

  describe('tablet 1 colspan item', () => {
    beforeEach(() => {
      row = fixtureSync(`
        <vaadin-board-row style="width: 750px;">
          <div board-cols="2">top A</div>
          <div>top B</div>
          <div>top C</div>
        </vaadin-board-row>
      `);
    });

    it('should make item with colspan 2 take 100% width', () => {
      const rowRect = row.getBoundingClientRect();
      const expectedLeftOffset = [0, 0, Math.floor((1 / 2) * rowRect.width)];
      const expectedTopOffset = [0, Math.floor((1 / 2) * rowRect.height), Math.floor((1 / 2) * rowRect.height)];

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();

        expect(rect.top).to.be.closeTo(rowRect.top + expectedTopOffset[i], 1);
        expect(rect.left).to.be.closeTo(rowRect.left + expectedLeftOffset[i], 1);
      }
    });
  });

  describe('tablet no colspan', () => {
    beforeEach(() => {
      row = fixtureSync(`
        <vaadin-board-row style="width: 750px;">
          <div>top A</div>
          <div>top B</div>
          <div>top C</div>
        </vaadin-board-row>
      `);
    });

    it('should make items without take 33% width', () => {
      const rowRect = row.getBoundingClientRect();
      const expectedLeftOffset = [0, Math.floor((1 / 3) * rowRect.width), Math.floor((2 / 3) * rowRect.width)];

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();

        expect(rect.top).to.equal(rowRect.top);
        expect(rect.left).to.be.closeTo(rowRect.left + expectedLeftOffset[i], 1);
      }
    });
  });

  describe('mobile 1 colspan item', () => {
    beforeEach(() => {
      row = fixtureSync(`
        <vaadin-board-row style="width: 310px;">
          <div board-cols="2">top A</div>
          <div>top B</div>
          <div>top C</div>
        </vaadin-board-row>
      `);
    });

    it('should make item with colspan 2 take 100% width', () => {
      const rowRect = row.getBoundingClientRect();

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();

        expect(rect.top).to.be.closeTo((i * rowRect.height) / 3 + rowRect.top, 1);
        expect(rect.left).to.equal(rowRect.left);
      }
    });
  });
});
