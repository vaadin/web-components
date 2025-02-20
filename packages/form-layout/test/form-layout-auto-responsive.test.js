import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-form-layout.js';

function assertFormLayoutGrid(layout, { columns, rows }) {
  const children = [...layout.children];
  expect(new Set(children.map((child) => child.offsetLeft)).size).to.equal(columns);
  expect(new Set(children.map((child) => child.offsetTop)).size).to.equal(rows);
}

describe('form-layout auto responsive', () => {
  describe('responsiveness', () => {
    let container, layout;

    beforeEach(async () => {
      container = fixtureSync(`
        <div style="width: 500px;">
          <vaadin-form-layout
            auto-responsive
            auto-rows
            max-columns="3"
            column-width="100px"
            style="--vaadin-form-layout-column-spacing: 0px;"
          >
            <input placeholder="First name">
            <input placeholder="Last Name">
            <input placeholder="Email">
            <input placeholder="Phone">
          </vaadin-form-layout>
        </div>`);
      layout = container.firstElementChild;
      await nextFrame();
    });

    it('should start with max number of columns', () => {
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
    });

    it('should adjust number of columns based on container width', () => {
      container.style.width = '300px';
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });

      container.style.width = '200px';
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });

      container.style.width = '100px';
      assertFormLayoutGrid(layout, { columns: 1, rows: 4 });

      container.style.width = '50px';
      assertFormLayoutGrid(layout, { columns: 1, rows: 4 });

      container.style.width = '200px';
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });

      container.style.width = '300px';
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
    });
  });
});
