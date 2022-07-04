import { expect } from '@esm-bundle/chai';
import { enter, esc, fixtureSync, focusin, keyDownOn, tab } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid-pro.js';
import '../vaadin-grid-pro-edit-column.js';
import { createItems, dblclick, dragAndDropOver, flushGrid, getCellEditor, getContainerCell } from './helpers.js';

describe('keyboard navigation', () => {
  let grid, input;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid-pro>
        <vaadin-grid-pro-edit-column path="name" suppress-template-warning
          <template class="header">Name</template>
          <template>[[index]] [[item.name]]</template>
          <template class="footer"></template>
        </vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
        <vaadin-grid-column path="name"></vaadin-grid-column>
      </vaadin-grid-pro>
    `);
    grid.items = createItems();
    flushGrid(grid);
  });

  describe('when `singleCellEdit` is true', () => {
    beforeEach(() => {
      grid.singleCellEdit = true;
    });

    it('should focus next cell content available for editing within a same row in non-edit mode on Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      const spy = sinon.spy(secondCell._content, 'focus');
      tab(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus previous cell content available for editing within a same row in non-edit mode on Shift Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 0);
      const spy = sinon.spy(secondCell._content, 'focus');
      tab(input, ['shift']);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus next cell content available for editing on the next row in non-edit mode on Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      const spy = sinon.spy(secondCell._content, 'focus');
      tab(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus previous cell content available for editing on the previous in non-edit mode on Shift Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 2, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      const spy = sinon.spy(secondCell._content, 'focus');
      tab(input, ['shift']);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus editable cell content on the next row in non-edit mode on Enter, if `enterNextRow` is true', () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      const spy = sinon.spy(secondCell._content, 'focus');
      enter(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should exit the edit mode for the cell on Enter, if `enterNextRow` is false', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      enter(input);
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus editable cell content on the previous row in non-edit mode on Shift Enter, if `enterNextRow` is true', () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 0, 0);
      const spy = sinon.spy(secondCell._content, 'focus');
      enter(input, ['shift']);
      expect(spy.calledOnce).to.be.true;
    });

    it('should exit the edit mode for the cell on Shift Enter, if `enterNextRow` is false', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      enter(input, ['shift']);
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus correct editable cell content after column reordering', () => {
      grid.columnReorderingAllowed = true;
      const headerContent = [
        getContainerCell(grid.$.header, 0, 0)._content,
        getContainerCell(grid.$.header, 0, 1)._content,
      ];
      dragAndDropOver(headerContent[0], headerContent[1]);

      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 0);
      const spy = sinon.spy(secondCell._content, 'focus');
      tab(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus correct editable cell content when column is hidden', () => {
      const column = grid.querySelector('vaadin-grid-pro-edit-column');
      column.hidden = true;

      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 1);
      const spy = sinon.spy(secondCell._content, 'focus');
      tab(input);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('when `singleCellEdit` is false', () => {
    it('should focus cell next available for editing within a same row in edit mode on Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      tab(input);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should not focus cell next available for editing on Tab if default prevented for it', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      input.addEventListener('keydown', (e) => e.keyCode === 9 && e.preventDefault());
      tab(input);
      expect(getCellEditor(firstCell)).to.be.ok;
    });

    it('should not focus cell next available for editing on Tab if `internal-tab` was fired right before it', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      input.dispatchEvent(new CustomEvent('internal-tab'));
      tab(input);
      expect(getCellEditor(firstCell)).to.be.ok;
    });

    it('should be possible to switch edit cell on Tab with delay after `internal-tab` was fired', (done) => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      input.dispatchEvent(new CustomEvent('internal-tab'));
      const secondCell = getContainerCell(grid.$.items, 1, 1);
      requestAnimationFrame(() => {
        tab(input);
        expect(getCellEditor(secondCell)).to.be.ok;
        done();
      });
    });

    it('should focus previous cell available for editing within a same row in edit mode on Shift Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 0);
      tab(input, ['shift']);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should focus cell next available for editing on the next row in edit mode on Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      tab(input);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should focus previous cell available for editing on the previous row in edit mode on Shift Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 2, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      tab(input, ['shift']);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should focus editable cell on the next row in edit mode on Enter, if `enterNextRow` is true', () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      enter(input);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should exit the edit mode for the cell on Enter, if `enterNextRow` is false', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      enter(input);
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus editable cell on the previous row in non-edit mode on Shift Enter, if `enterNextRow` is true', () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 0, 0);
      enter(input, ['shift']);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should not re-focus previous cell content in edit mode on Enter, if `enterNextRow` is true', () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      input = getCellEditor(firstCell).inputElement;

      const spy = sinon.spy(firstCell._content, 'focus');
      enter(input);
      expect(spy.called).to.be.false;
    });

    it('should exit the edit mode for the cell on Shift Enter, if `enterNextRow` is false', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      enter(input, ['shift']);
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });
  });

  describe('tabindex', () => {
    let firstCell;

    beforeEach(() => {
      firstCell = getContainerCell(grid.$.items, 0, 0);
    });

    it('should not set tabindex attribute on editable cell', () => {
      expect(firstCell.hasAttribute('tabindex')).to.be.false;
    });

    it('should set tabindex to 0 on first visible editable cell content', () => {
      expect(firstCell._content.getAttribute('tabindex')).to.equal('0');
    });

    it('should update tabindex when moving focus between editable cells', () => {
      const cell = getContainerCell(grid.$.items, 1, 0);

      focusin(cell._content, firstCell._content);

      expect(cell._content.getAttribute('tabindex')).to.equal('0');
      expect(firstCell._content.getAttribute('tabindex')).to.equal('-1');
    });

    it('should update tabindex when moving from editable to readonly cell', () => {
      const cell = getContainerCell(grid.$.items, 0, 2);

      focusin(cell, firstCell._content);

      expect(cell.getAttribute('tabindex')).to.equal('0');
      expect(firstCell._content.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('navigation mode', () => {
    let cell, content;

    beforeEach(() => {
      cell = getContainerCell(grid.$.items, 1, 1);
      content = cell._content;
      content.focus();
    });

    it('should enable navigation mode on focusing cell content', () => {
      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });

    it('should disable navigation mode on cell content Enter', () => {
      enter(content);

      expect(grid.hasAttribute('navigating')).to.be.false;
      expect(grid.hasAttribute('interacting')).to.be.true;
    });

    it('should keep navigation mode on cell content ArrowUp', () => {
      keyDownOn(content, 38, [], 'ArrowUp');

      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });

    it('should keep navigation mode on cell content ArrowDown', () => {
      keyDownOn(content, 40, [], 'ArrowDown');

      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });

    it('should keep navigation mode on cell content ArrowLeft', () => {
      keyDownOn(content, 37, [], 'ArrowLeft');

      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });

    it('should keep navigation mode on cell content ArrowRight', () => {
      keyDownOn(content, 39, [], 'ArrowRight');

      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });

    it('should keep navigation mode on cell content PageDown', () => {
      keyDownOn(content, 34, [], 'PageDown');

      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });

    it('should keep navigation mode on cell content PageDown', () => {
      keyDownOn(content, 33, [], 'PageUp');

      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });

    it('should keep navigation mode on cell content Home', () => {
      keyDownOn(content, 36, [], 'Home');

      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });

    it('should keep navigation mode on cell content End', () => {
      keyDownOn(content, 35, [], 'End');

      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });
  });

  describe('Esc key', () => {
    let cell, content;

    beforeEach(() => {
      cell = getContainerCell(grid.$.items, 1, 0);
      content = cell._content;
      content.focus();
    });

    it('should exit the edit mode for the cell', () => {
      dblclick(content);
      input = getCellEditor(cell);

      esc(input);
      expect(getCellEditor(cell)).to.be.not.ok;
    });

    it('should focus cell content after exiting edit mode', () => {
      enter(content);
      input = getCellEditor(cell);

      const focusSpy = sinon.spy(content, 'focus');
      const stopSpy = sinon.spy(grid, '_stopEdit');
      esc(input);

      expect(focusSpy.calledAfter(stopSpy)).to.be.true;
    });

    it('should restore navigation mode on the grid', () => {
      dblclick(content);
      input = getCellEditor(cell);

      esc(input);

      expect(grid.hasAttribute('navigating')).to.be.true;
      expect(grid.hasAttribute('interacting')).to.be.false;
    });
  });
});
