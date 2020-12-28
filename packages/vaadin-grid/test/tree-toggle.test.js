import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { click, flushGrid, getBodyCellContent } from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-tree-toggle.js';
import '../vaadin-grid-tree-column.js';

describe('tree toggle', () => {
  let toggle;

  describe('default', () => {
    beforeEach(() => {
      toggle = fixtureSync('<vaadin-grid-tree-toggle></vaadin-grid-tree-toggle>');
    });

    describe('properties', () => {
      it('should have leaf false by default', () => {
        expect(toggle.leaf).to.not.be.ok;
      });

      it('should have expanded false by default', () => {
        expect(toggle.expanded).to.not.be.ok;
      });

      it('should not toggle on click if leaf', () => {
        toggle.leaf = true;

        const clickEvent = click(toggle);
        expect(toggle.expanded).to.not.be.ok;
        expect(clickEvent.defaultPrevented).to.be.false;
      });

      it('should toggle on click', () => {
        let clickEvent = click(toggle);
        expect(toggle.expanded).to.be.true;
        expect(clickEvent.defaultPrevented).to.be.true;

        clickEvent = click(toggle);
        expect(toggle.expanded).to.be.false;
        expect(clickEvent.defaultPrevented).to.be.true;
      });

      it('should notify for expanded on toggle', () => {
        const spy = sinon.spy();
        toggle.addEventListener('expanded-changed', spy);

        click(toggle);

        expect(spy.callCount).to.equal(1);

        toggle.removeEventListener('expanded-changed', spy);
      });
    });

    describe('level', () => {
      it('should have level zero by default', () => {
        expect(toggle.level).to.equal(0);
      });

      it('should have zero spacer width by default', () => {
        const spacer = toggle.shadowRoot.querySelector('#level-spacer');
        expect(spacer.getBoundingClientRect().width).to.equal(0);
      });

      it('should increase spacer width for each level step', () => {
        const spacer = toggle.shadowRoot.querySelector('#level-spacer');
        let prevWidth = 0;
        for (let i = 1; i < 3; i++) {
          toggle.level = i;
          const width = spacer.getBoundingClientRect().width;
          expect(width).to.be.gt(prevWidth);
          prevWidth = width;
        }
      });
    });

    describe('DOM', () => {
      it('should have default slot', () => {
        const slot = toggle.shadowRoot.querySelector('slot:not([name])');
        expect(slot).to.be.ok;
      });

      it('should have toggle shadow part', () => {
        expect(toggle.shadowRoot.querySelector(`[part~="toggle"]`)).to.not.be.null;
      });
    });
  });

  describe('with content', () => {
    beforeEach(() => {
      toggle = fixtureSync(`
        <vaadin-grid-tree-toggle>
          <input><div>foo</div>
        </vaadin-grid-tree-toggle>
      `);
    });

    it('should not toggle on internal focusable click', () => {
      const clickEvent = click(toggle.querySelector('input'));
      expect(toggle.expanded).to.be.false;
      expect(clickEvent.defaultPrevented).to.be.false;
    });

    it('should toggle on internal non-focusable element click', () => {
      const clickEvent = click(toggle.querySelector('div'));
      expect(toggle.expanded).to.be.true;
      expect(clickEvent.defaultPrevented).to.be.true;
    });
  });

  describe('tree column', () => {
    let grid, column, toggle;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-tree-column></vaadin-grid-tree-column>
        </vaadin-grid>
      `);
      column = grid.querySelector('vaadin-grid-tree-column');
      grid.dataProvider = (params, cb) => {
        cb([{ name: 'foo', hasChildren: true }], 1);
      };
      flushGrid(grid);
      toggle = getBodyCellContent(grid, 0, 0).firstElementChild;
    });

    it('should be empty', () => {
      expect(toggle.textContent.trim()).to.be.empty;
    });

    it('should not be empty', () => {
      column.path = 'name';
      expect(toggle.textContent.trim()).to.equal('foo');
    });

    it('should be a leaf', () => {
      expect(toggle.leaf).to.be.true;
    });

    it('should not be a leaf', () => {
      column.itemHasChildrenPath = 'hasChildren';
      expect(toggle.leaf).to.be.false;
    });
  });
});
