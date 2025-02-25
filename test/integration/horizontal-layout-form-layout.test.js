import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item.js';
import '@vaadin/horizontal-layout';
import { assertFormLayoutGrid, assertFormLayoutLabelPosition } from '@vaadin/form-layout/test/helpers.js';

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

      it('should start with max number of columns', () => {
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
        });
      });

      it('should adjust number of columns based on horizontal layout width', async () => {
        await setViewport({ width: 600, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
        });

        await setViewport({ width: 400, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
        });

        await setViewport({ width: 200, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
        });

        await setViewport({ width: 50, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
        });

        await setViewport({ width: 200, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
        });

        await setViewport({ width: 400, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
        });

        await setViewport({ width: 600, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
        });
      });
    });

    describe('labels aside', () => {
      beforeEach(async () => {
        horizontalLayout = fixtureSync(`
          <vaadin-horizontal-layout>
            ${Array.from(
              { length: 2 },
              () => `
                <vaadin-form-layout
                  auto-responsive
                  auto-rows
                  max-columns="2"
                  column-width="100px"
                  labels-aside
                  style="
                    --vaadin-form-layout-column-spacing: 0px;
                    --vaadin-form-layout-label-width: 100px;
                    --vaadin-form-layout-label-spacing: 50px;
                  "
                >
                  <vaadin-form-item>
                    <label slot="label">First name</label>
                    <input />
                  </vaadin-form-item>
                  <vaadin-form-item>
                    <label slot="label">Last Name</label>
                    <input />
                  </vaadin-form-item>
                  <vaadin-form-item>
                    <label slot="label">Email</label>
                    <input />
                  </vaadin-form-item>
                  <vaadin-form-item>
                    <label slot="label">Phone</label>
                    <input />
                  </vaadin-form-item>
                </vaadin-form-layout>
              `,
            ).join('')}
          </vaadin-horizontal-layout>
        `);
        formLayouts = [...horizontalLayout.querySelectorAll('vaadin-form-layout')];
        await nextFrame();
      });

      it('should start with max number of columns and labels positioned aside', () => {
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
          assertFormLayoutLabelPosition(layout, { position: 'aside' });
        });
      });

      it('should adjust number of columns and label position based on horizontal layout width', async () => {
        await setViewport({ width: 1000, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
          assertFormLayoutLabelPosition(layout, { position: 'aside' });
        });

        await setViewport({ width: 500, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
          assertFormLayoutLabelPosition(layout, { position: 'aside' });
        });

        await setViewport({ width: 400, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
          assertFormLayoutLabelPosition(layout, { position: 'above' });
        });

        await setViewport({ width: 200, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
          assertFormLayoutLabelPosition(layout, { position: 'above' });
        });

        await setViewport({ width: 400, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
          assertFormLayoutLabelPosition(layout, { position: 'above' });
        });

        await setViewport({ width: 500, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
          assertFormLayoutLabelPosition(layout, { position: 'aside' });
        });

        await setViewport({ width: 1000, height: 768 });
        await nextResize(horizontalLayout);
        formLayouts.forEach((layout) => {
          assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
          assertFormLayoutLabelPosition(layout, { position: 'aside' });
        });
      });
    });
  });
});
