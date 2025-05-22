import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-board-row.js';

describe('vaadin-board-row', () => {
  let row;

  describe('desktop', () => {
    describe('4 items', () => {
      beforeEach(() => {
        row = fixtureSync(`
          <vaadin-board-row style="width: 1200px;">
            <div>top A</div>
            <div>top B</div>
            <div>top C</div>
            <div>top D</div>
          </vaadin-board-row>
        `);
      });

      it('should make each item take 25% width', () => {
        const rowRect = row.getBoundingClientRect();

        for (let i = 0; i < row.children.length; i++) {
          const rect = row.children[i].getBoundingClientRect();

          expect(rect.top).to.equal(rowRect.top);
          expect(rect.left).to.be.closeTo((i * rowRect.width) / 4 + rowRect.left, 1);
        }
      });
    });

    describe('2 items', () => {
      beforeEach(() => {
        row = fixtureSync(`
          <vaadin-board-row style="width: 1200px;">
            <div>top A</div>
            <div>top B</div>
          </vaadin-board-row>
        `);
      });

      it('should make each item take 50% width', () => {
        const rowRect = row.getBoundingClientRect();

        for (let i = 0; i < row.children.length; i++) {
          const rect = row.children[i].getBoundingClientRect();

          expect(rect.top).to.equal(rowRect.top);
          expect(rect.left).to.be.closeTo((i * rowRect.width) / 2 + rowRect.left, 1);
        }
      });
    });
  });

  describe('tablet', () => {
    describe('4 items', () => {
      beforeEach(() => {
        row = fixtureSync(`
          <vaadin-board-row style="width: 750px;">
            <div>top A</div>
            <div>top B</div>
            <div>top C</div>
            <div>top D</div>
          </vaadin-board-row>
        `);
      });

      it('should make each item take 50% width', () => {
        const rowRect = row.getBoundingClientRect();

        for (let i = 0; i < row.children.length; i++) {
          const rect = row.children[i].getBoundingClientRect();

          expect(rect.top).to.be.closeTo((Math.floor(i / 2) * rowRect.height) / 2 + rowRect.top, 1);
          expect(rect.left).to.be.closeTo(((i % 2) * rowRect.width) / 2 + rowRect.left, 1);
        }
      });
    });

    describe('2 items', () => {
      beforeEach(() => {
        row = fixtureSync(`
          <vaadin-board-row style="width: 750px;">
            <div>top A</div>
            <div>top B</div>
          </vaadin-board-row>
        `);
      });

      it('should make each item take 50% width', () => {
        const rowRect = row.getBoundingClientRect();

        for (let i = 0; i < row.children.length; i++) {
          const rect = row.children[i].getBoundingClientRect();

          expect(rect.top).to.equal(rowRect.top);
          expect(rect.left).to.be.closeTo(((i % 2) * rowRect.width) / 2 + rowRect.left, 1);
        }
      });
    });
  });

  describe('mobile', () => {
    beforeEach(() => {
      row = fixtureSync(`
        <vaadin-board-row style="width: 310px;">
          <div>top A</div>
          <div>top B</div>
          <div>top C</div>
          <div>top D</div>
        </vaadin-board-row>
      `);
    });

    it('should make each item take 100% width', () => {
      const rowRect = row.getBoundingClientRect();

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();

        expect(rect.top).to.be.closeTo((i * rowRect.height) / 4 + rowRect.top, 1);
        expect(rect.left).to.equal(rowRect.left);
      }
    });
  });
});
