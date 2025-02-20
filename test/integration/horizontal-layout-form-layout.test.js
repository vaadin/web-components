import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/form-layout';
import '@vaadin/horizontal-layout';

function assertFormLayoutGrid(layout, { columns, rows }) {
  const children = [...layout.children];
  expect(new Set(children.map((child) => child.offsetLeft)).size).to.equal(columns);
  expect(new Set(children.map((child) => child.offsetTop)).size).to.equal(rows);
}

describe('form-layouts in horizontal-layout', () => {
  let horizontalLayout, formLayouts;

  beforeEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  describe('auto-responsive', () => {
    beforeEach(async () => {
      horizontalLayout = fixtureSync(`
        <vaadin-horizontal-layout>
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
      await setViewport({ width: 600, height: 768 });
      formLayouts.forEach((layout) => {
        assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
      });

      await setViewport({ width: 400, height: 768 });
      formLayouts.forEach((layout) => {
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
      });

      await setViewport({ width: 200, height: 768 });
      formLayouts.forEach((layout) => {
        assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
      });

      await setViewport({ width: 50, height: 768 });
      formLayouts.forEach((layout) => {
        assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
      });

      await setViewport({ width: 200, height: 768 });
      formLayouts.forEach((layout) => {
        assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
      });

      await setViewport({ width: 400, height: 768 });
      formLayouts.forEach((layout) => {
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
      });

      await setViewport({ width: 600, height: 768 });
      formLayouts.forEach((layout) => {
        assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
      });
    });
  });
});
