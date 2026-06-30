import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-grid.js';
import { getBodyCellContent } from './helpers.js';

describe('activate events', () => {
  let grid, column;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    column = grid.firstElementChild;
    column.renderer = (root, _owner, model) => {
      root.textContent = `${model.index} ${model.item.name}`;
    };
    grid.items = [{ name: 'Item 0' }, { name: 'Item 1' }];
    // Focus grid
    await sendKeys({ press: 'Tab' });
  });

  describe('cell-activate', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      grid.addEventListener('cell-activate', spy);
    });

    it('should fire on cell click', () => {
      getBodyCellContent(grid, 0, 0).click();
      expect(spy).to.be.calledOnce;

      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.equal(0);
      expect(e.detail.model.item).to.be.ok;
    });

    it('should fire on cell Space', async () => {
      await sendKeys({ press: 'Space' });
      expect(spy).to.be.calledOnce;

      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.equal(0);
      expect(e.detail.model.item).to.be.ok;
    });

    it('should not fire on row Space', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'Space' });
      expect(spy).not.to.be.called;
    });

    it('should not fire on focusable element click', () => {
      column.renderer = (root) => {
        root.innerHTML = '<input>';
      };
      getBodyCellContent(grid, 0, 0).firstElementChild.click();
      expect(spy).not.to.be.called;
    });

    it('should not fire on label click', () => {
      column.renderer = (root) => {
        root.innerHTML = '<label for="foo">foo label</label><input id="foo">';
      };
      getBodyCellContent(grid, 0, 0).firstElementChild.click();
      expect(spy).not.to.be.called;
    });
  });

  describe('row-activate', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      grid.addEventListener('row-activate', spy);
    });

    it('should fire on row Space', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'Space' });
      expect(spy).to.be.calledOnce;

      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.equal(0);
      expect(e.detail.model.item).to.be.ok;
    });

    it('should not fire on cell Space', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Space' });
      expect(spy).not.to.be.called;
    });
  });
});
