import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/form-layout';
import '@vaadin/horizontal-layout';
import { assertFormLayoutGrid } from '@vaadin/form-layout/test/helpers.js';

describe('form-layouts in horizontal-layout', () => {
  let horizontalLayout, formLayouts;

  beforeEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  describe('auto-responsive', () => {
    describe('basic', () => {
      beforeEach(async () => {
        horizontalLayout = fixtureSync(`
          <vaadin-horizontal-layout>
            ${Array.from(
              { length: 2 },
              () => `
                <vaadin-form-layout
                  auto-responsive
                  auto-rows
                  max-columns="3"
                  column-width="100px"
                  style="--vaadin-form-layout-column-spacing: 0px;"
                >
                  <input placeholder="First name">
                  <input placeholder="Last name">
                  <input placeholder="Email">
                  <input placeholder="Phone">
                </vaadin-form-layout>
              `,
            ).join('')}
          </vaadin-horizontal-layout>
        `);
        formLayouts = [...horizontalLayout.querySelectorAll('vaadin-form-layout')];
        await nextFrame();
      });

      it('should start with max number of form layout columns', () => {
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
        });
      });

      it('should adjust number of form layout columns based on horizontal layout width', async () => {
        const breakpoints = [
          { width: 600, columns: 3, rows: 2 },
          { width: 400, columns: 2, rows: 2 },
          { width: 200, columns: 1, rows: 4 },
          { width: 50, columns: 1, rows: 4 },
          { width: 200, columns: 1, rows: 4 },
          { width: 400, columns: 2, rows: 2 },
          { width: 600, columns: 3, rows: 2 },
        ];

        for (const { width, columns, rows } of breakpoints) {
          await setViewport({ width, height: 768 });
          await nextResize(horizontalLayout);

          formLayouts.forEach((layout) => {
            assertFormLayoutGrid(layout, { columns, rows });
          });
        }
      });
    });
  });
});
