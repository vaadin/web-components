import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../grid-test-styles.js';
import '../../vaadin-grid.js';
import { users } from '../visual/users.js';

describe('vaadin-grid', () => {
  let grid;

  describe('basic', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column path="name.first"></vaadin-grid-column>
          <vaadin-grid-column path="name.last"></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.items = users.slice(0, 2);
      await nextFrame();
    });

    describe('host', () => {
      it('default', async () => {
        await expect(grid).dom.to.equalSnapshot();
      });
    });

    describe('shadow', () => {
      it('default', async () => {
        await expect(grid).shadowDom.to.equalSnapshot();
      });

      it('selected', async () => {
        grid.selectedItems = [grid.items[0]];
        await expect(grid).shadowDom.to.equalSnapshot();
      });

      it('details opened', async () => {
        grid.detailsOpenedItems = [grid.items[0]];
        await expect(grid).shadowDom.to.equalSnapshot();
      });

      it('hidden column', async () => {
        grid.querySelector('vaadin-grid-column').hidden = true;
        await nextFrame();
        await expect(grid).shadowDom.to.equalSnapshot();
      });

      it('hidden column selected', async () => {
        grid.selectedItems = [grid.items[0]];
        grid.querySelector('vaadin-grid-column').hidden = true;
        await nextFrame();
        await expect(grid).shadowDom.to.equalSnapshot();
      });

      it('with footer', async () => {
        grid.querySelector('vaadin-grid-column').footerRenderer = (root) => {
          root.textContent = 'Footer';
        };
        await nextFrame();
        await expect(grid).shadowDom.to.equalSnapshot();
      });
    });
  });

  describe('column groups', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column-group>
            <vaadin-grid-column path="name.first"></vaadin-grid-column>
            <vaadin-grid-column path="name.last"></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid>
      `);
      grid.items = users.slice(0, 2);
      await nextFrame();
    });

    it('default', async () => {
      await expect(grid).shadowDom.to.equalSnapshot();
    });

    it('with header', async () => {
      grid.querySelector('vaadin-grid-column-group').headerRenderer = (root) => {
        root.textContent = 'Header';
      };
      await nextFrame();
      await expect(grid).shadowDom.to.equalSnapshot();
    });

    it('with footer', async () => {
      grid.querySelector('vaadin-grid-column-group').footerRenderer = (root) => {
        root.textContent = 'Footer';
      };
      await nextFrame();
      await expect(grid).shadowDom.to.equalSnapshot();
    });
  });
});
