import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, isIOS, keyDownOn } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import { flushGrid, getCell } from './helpers.js';

describe('activate events', () => {
  let grid, column;

  describe('cell-activate', () => {
    let spy;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);
      column = grid.firstElementChild;
      grid.items = [{ foo: 'bar' }, { foo: 'baz' }];
      column.renderer = (root, _owner, model) => {
        root.textContent = `${model.index} ${model.item.foo}`;
      };
      flushGrid(grid);

      spy = sinon.spy();
      grid.addEventListener('cell-activate', spy);
    });

    it('should fire a `cell-activate` event with correct model on cell click', () => {
      getCell(grid, 0)._content.click();
      expect(spy.calledOnce).to.be.true;

      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.eql(0);
      expect(e.detail.model.item).to.be.ok;
    });

    (isIOS ? it.skip : it)('should fire a `cell-activate` event with correct model on space', () => {
      keyDownOn(getCell(grid, 0) || grid.shadowRoot.activeElement, 32, [], ' ');
      expect(spy.calledOnce).to.be.true;

      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.eql(0);
      expect(e.detail.model.item).to.be.ok;
    });

    it('should not fire a `cell-activate` event on focusable element click', () => {
      column.renderer = (root) => {
        root.innerHTML = '<input>';
      };
      getCell(grid, 0)._content.firstElementChild.click();
      expect(spy.called).to.be.false;
    });

    it('should not fire a `cell-activate` event on label click', () => {
      column.renderer = (root) => {
        root.innerHTML = '<label for="foo">foo label</label><input id="foo">';
      };
      getCell(grid, 0)._content.firstElementChild.click();
      expect(spy.called).to.be.false;
    });
  });

  describe('row-activate', () => {
    let spy;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);
      column = grid.firstElementChild;
      grid.items = [{ foo: 'bar' }, { foo: 'baz' }];
      column.renderer = (root, _owner, model) => {
        root.textContent = `${model.index} ${model.item.foo}`;
      };
      flushGrid(grid);

      spy = sinon.spy();
      grid.addEventListener('row-activate', spy);
    });

    // Focus the first body cell, then press left arrow to enter row focus mode,
    // where the row itself is focused instead of a cell.
    function enterRowFocusMode() {
      getCell(grid, 0).focus();
      keyDownOn(grid.shadowRoot.activeElement, 37, [], 'ArrowLeft');
    }

    (isIOS ? it.skip : it)('should fire a `row-activate` event with correct model on space', () => {
      enterRowFocusMode();
      keyDownOn(grid.shadowRoot.activeElement, 32, [], ' ');
      expect(spy.calledOnce).to.be.true;

      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.eql(0);
      expect(e.detail.model.item).to.be.ok;
    });

    (isIOS ? it.skip : it)('should not fire a `cell-activate` event on space in row focus mode', () => {
      const cellSpy = sinon.spy();
      grid.addEventListener('cell-activate', cellSpy);

      enterRowFocusMode();
      keyDownOn(grid.shadowRoot.activeElement, 32, [], ' ');
      expect(cellSpy.called).to.be.false;
    });
  });
});
