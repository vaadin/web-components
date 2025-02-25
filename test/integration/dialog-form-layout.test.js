import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextResize } from '@vaadin/testing-helpers';
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
    // Dialog adds a total gap of 80px between the layout and the viewport
    const DIALOG_GAP = 80;

    describe('basic', () => {
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
        const breakpoints = [
          { width: 300, columns: 3, rows: 2 },
          { width: 200, columns: 2, rows: 2 },
          { width: 100, columns: 1, rows: 4 },
          { width: 50, columns: 1, rows: 4 },
          { width: 100, columns: 1, rows: 4 },
          { width: 200, columns: 2, rows: 2 },
          { width: 300, columns: 3, rows: 2 },
        ];

        for (const { width, columns, rows } of breakpoints) {
          await setViewport({ width: width + DIALOG_GAP, height: 768 });
          await nextResize(layout);
          assertFormLayoutGrid(layout, { columns, rows });
        }
      });
    });
  });
});
