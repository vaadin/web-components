import { expect } from '@esm-bundle/chai';
import { arrowLeft, arrowRight, aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid.js';
import { flushGrid } from './helpers.js';

let grid;

function getRowCell(rowIndex, cellIndex) {
  return grid.$.items.children[rowIndex].children[cellIndex];
}

function getRowFirstCell(rowIndex) {
  return getRowCell(rowIndex, 0);
}

describe('keyboard navigation - cell button', () => {
  let cell;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="name" _cell-button></vaadin-grid-column>
        <vaadin-grid-column path="name"></vaadin-grid-column>
      </vaadin-grid>
    `);

    grid.items = [{ name: 'foo' }, { name: 'bar' }];

    grid._observer.flush();
    flushGrid(grid);

    await aTimeout(0);

    cell = getRowFirstCell(0);
  });

  it('should create a focusable div with role="button" inside the cell', () => {
    expect(cell.firstChild.localName).to.equal('div');
    expect(cell.firstChild.getAttribute('role')).to.equal('button');
  });

  it('should set tabindex on the focusable div inside the cell', () => {
    expect(cell.hasAttribute('tabindex')).to.be.false;
    expect(cell.firstChild.getAttribute('tabindex')).to.equal('0');
  });

  it('should focus the focusable div when calling `focus()` on the cell', () => {
    const spy = sinon.spy(cell.firstChild, 'focus');
    cell.focus();
    expect(spy.calledOnce).to.be.true;
  });

  it('should update tabindex on the div when focusing another cell', () => {
    const cell2 = getRowFirstCell(1);

    cell2.focus();

    expect(cell.firstChild.getAttribute('tabindex')).to.equal('-1');
    expect(cell2.firstChild.getAttribute('tabindex')).to.equal('0');
  });

  it('should update tabindex on the div when enabling row focus mode', () => {
    cell.focus();
    arrowLeft(cell.firstChild);
    expect(cell.firstChild.getAttribute('tabindex')).to.equal('-1');
  });

  it('should restore tabindex on the div when disabling row focus mode', () => {
    cell.focus();
    arrowLeft(cell.firstChild);
    arrowRight(cell.firstChild);
    expect(cell.firstChild.getAttribute('tabindex')).to.equal('0');
  });
});
