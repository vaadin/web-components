import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item.js';
import '@vaadin/dialog';
import { assertFormLayoutGrid } from '@vaadin/form-layout/test/helpers.js';

describe('form-layout in dialog', () => {
  let dialog, layout;

  beforeEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  describe('basic', () => {
    beforeEach(async () => {
      dialog = fixtureSync(`<vaadin-dialog></vaadin-dialog>`);
      dialog.renderer = (root) => {
        root.innerHTML = `
        <vaadin-form-layout>
          <vaadin-form-item>
            <label slot="label">First name</label>
            <input />
          </vaadin-form-item>
          <vaadin-form-item>
            <label slot="label">Last name</label>
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
      `;
      };
      dialog.opened = true;
      await nextRender();
      layout = dialog.$.overlay.querySelector('vaadin-form-layout');
    });

    afterEach(async () => {
      dialog.opened = false;
      await nextFrame();
    });

    it('should arrange form items in 2x2 grid', () => {
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
    });
  });

  describe('auto-responsive', () => {
    beforeEach(async () => {
      dialog = fixtureSync(`<vaadin-dialog></vaadin-dialog>`);
      dialog.renderer = (root) => {
        root.innerHTML = `
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
        `;
      };
      dialog.opened = true;
      await nextRender();
      layout = dialog.$.overlay.querySelector('vaadin-form-layout');
    });

    afterEach(async () => {
      dialog.opened = false;
      await nextFrame();
    });

    it('should start with max number of form layout columns', () => {
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
    });

    it('should adjust number of form layout columns based on dialog width', async () => {
      // Dialog adds a total gap of 80px between the layout and the viewport
      const dialogGap = 80;

      await setViewport({ width: 300 + dialogGap, height: 768 });
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });

      await setViewport({ width: 200 + dialogGap, height: 768 });
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });

      await setViewport({ width: 100 + dialogGap, height: 768 });
      assertFormLayoutGrid(layout, { columns: 1, rows: 4 });

      await setViewport({ width: 50 + dialogGap, height: 768 });
      assertFormLayoutGrid(layout, { columns: 1, rows: 4 });

      await setViewport({ width: 200 + dialogGap, height: 768 });
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });

      await setViewport({ width: 300 + dialogGap, height: 768 });
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
    });
  });
});
