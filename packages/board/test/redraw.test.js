import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-board.js';
import { allResized, onceResized } from './helpers.js';

describe('redraw', () => {
  describe('board', () => {
    let board, row;

    beforeEach(async () => {
      board = fixtureSync(`
        <vaadin-board style="width: 1200px;">
          <vaadin-board-row id="top">
            <div>top A</div>
            <div>top B</div>
            <div>top C</div>
            <div>top D</div>
          </vaadin-board-row>
        </vaadin-board>
      `);
      row = board.firstElementChild;
      await onceResized(row);
    });

    it('should trigger layout after board style is changed', () => {
      board.style.width = '700px';
      board.redraw();

      const row = board.querySelector('#top');
      const rowRect = row.getBoundingClientRect();

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();
        expect(rect.left).to.be.closeTo(((i % 2) * rowRect.width) / 2 + rowRect.left, 1);
        expect(rect.top).to.be.closeTo((Math.floor(i / 2) * rowRect.height) / 2 + rowRect.top, 1);
      }
    });
  });

  describe('row', () => {
    let row;

    beforeEach(async () => {
      row = fixtureSync(`
        <vaadin-board-row style="width: 1200px;">
          <div>top A</div>
          <div>top B</div>
          <div>top C</div>
          <div>top D</div>
        </vaadin-board-row>
      `);
      await onceResized(row);
    });

    it('should trigger layout after board row style is changed', () => {
      row.style.width = '700px';
      row.redraw();

      const rowRect = row.getBoundingClientRect();

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();
        expect(rect.left).to.be.closeTo(((i % 2) * rowRect.width) / 2 + rowRect.left, 1);
        expect(rect.top).to.be.closeTo((Math.floor(i / 2) * rowRect.height) / 2 + rowRect.top, 1);
      }
    });
  });

  describe('nested row', () => {
    let board, row;

    beforeEach(async () => {
      board = fixtureSync(`
        <vaadin-board style="width: 1200px;">
          <vaadin-board-row id="top" board-cols="2">
            <div>top A</div>
            <vaadin-board-row id="nested">
              <div>low B / A</div>
              <div>low B / B</div>
              <div>low B / C</div>
              <div>low B / D</div>
            </vaadin-board-row>
          </vaadin-board-row>
        </vaadin-board>
      `);
      row = board.querySelector('#nested');

      await onceResized(row);
    });

    it('should trigger layout for nested rows after board style is changed', () => {
      board.style.width = '900px';
      board.redraw();

      const row = board.querySelector('#nested');
      const rowRect = row.getBoundingClientRect();

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();
        expect(rect.left).to.be.closeTo(rowRect.left, 1);
        expect(rect.top).to.be.closeTo(rowRect.top + rect.height * i, 1);
      }
    });

    it('should have the same size after changing from 1200px to 900px and back', () => {
      const rowRect = row.getBoundingClientRect();
      const expectedLeftOffset = [0, Math.floor((1 / 2) * rowRect.width), 0, Math.floor((1 / 2) * rowRect.width)];

      board.style.width = '900px';
      board.redraw();
      board.style.width = '1200px';
      board.redraw();

      const expectedTopOffset = [0, 0, Math.floor((1 / 2) * rowRect.height), Math.floor((1 / 2) * rowRect.height)];

      for (let i = 0; i < row.children.length; i++) {
        const rect = row.children[i].getBoundingClientRect();
        // TODO: Delta=4 as a workaround for https://github.com/vaadin/vaadin-board/issues/121
        expect(rect.left).to.be.closeTo(rowRect.left + expectedLeftOffset[i], 4);
        expect(rect.top).to.be.closeTo(rowRect.top + expectedTopOffset[i], 4);
      }
    });
  });

  describe('row class names', () => {
    let container, board, first, second, third;

    beforeEach(async () => {
      container = fixtureSync(`
        <div style="width: 1000px;">
          <vaadin-board>
            <vaadin-board-row id="first">
              <div>first A</div>
              <div>first B</div>
              <div>first C</div>
              <div>first D</div>
            </vaadin-board-row>
            <vaadin-board-row id="second">
              <div>second A</div>
              <div>second B</div>
              <div>second C</div>
              <div>second D</div>
            </vaadin-board-row>
            <vaadin-board-row id="third">
              <div>third A</div>
              <div>third B</div>
              <div>third C</div>
              <div>third D</div>
            </vaadin-board-row>
          </vaadin-board>
        </div>
      `);
      board = container.querySelector('vaadin-board');
      first = container.querySelector('#first');
      second = container.querySelector('#second');
      third = container.querySelector('#third');

      await allResized([first, second, third]);
    });

    it('should set correct class name to rows by default', () => {
      expect(first.className).to.equal('large');
      expect(second.className).to.equal('large');
      expect(third.className).to.equal('large');
    });

    it('should update rows on redraw after breakpoints change', () => {
      container.style.setProperty('--vaadin-board-width-small', '1200px');
      container.style.setProperty('--vaadin-board-width-medium', '1500px');

      expect(first.className).to.equal('large');
      expect(second.className).to.equal('large');
      expect(third.className).to.equal('large');

      board.redraw();

      expect(first.className).to.equal('small');
      expect(second.className).to.equal('small');
      expect(third.className).to.equal('small');
    });

    it('should update rows on redraw after container resize', () => {
      container.style.setProperty('width', '800px');

      expect(first.className).to.equal('large');
      expect(second.className).to.equal('large');
      expect(third.className).to.equal('large');

      board.redraw();

      expect(first.className).to.equal('medium');
      expect(second.className).to.equal('medium');
      expect(third.className).to.equal('medium');
    });

    it('should only update class on resize or breakpoint change', async () => {
      first.className = '';
      await aTimeout(100);
      expect(first.className).to.equal('');

      container.style.width = '1001px';
      await onceResized(first);
      expect(first.className).to.equal('large');
    });
  });

  describe('nested row class names', () => {
    let container, board, outer, inner;

    beforeEach(async () => {
      container = fixtureSync(`
        <div style="width: 1000px;">
          <vaadin-board>
            <vaadin-board-row id="outer">
              <div>first A</div>
              <div>first B</div>
              <vaadin-board-row id="inner">
                <div>second A</div>
                <div>second B</div>
                <div>second C</div>
              </vaadin-board-row>
            </vaadin-board-row>
          </vaadin-board>
        </div>
      `);
      board = container.querySelector('vaadin-board');
      outer = container.querySelector('#outer');
      inner = container.querySelector('#inner');

      await allResized([inner, outer]);
    });

    it('should update nested rows on redraw after breakpoint change', () => {
      expect(outer.className).to.equal('large');
      expect(inner.className).to.equal('small');

      inner.setAttribute('class', '');
      container.style.setProperty('--vaadin-board-width-small', '601px');
      board.redraw();

      expect(inner.className).to.equal('small');
    });
  });
});
