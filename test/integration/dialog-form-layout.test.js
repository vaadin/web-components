import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextResize } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item.js';
import '@vaadin/dialog';

function assertFormLayoutGrid(layout, { columns, rows }) {
  const children = [...layout.children];
  expect(new Set(children.map((child) => child.offsetLeft)).size).to.equal(columns, `expected ${columns} columns`);
  expect(new Set(children.map((child) => child.offsetTop)).size).to.equal(rows, `expected ${rows} rows`);
}

function assertFormLayoutLabelPosition(layout, { position }) {
  const columnWidth = parseFloat(layout.columnWidth);
  const labelWidth = parseFloat(getComputedStyle(layout).getPropertyValue('--vaadin-form-layout-label-width'));
  const labelSpacing = parseFloat(getComputedStyle(layout).getPropertyValue('--vaadin-form-layout-label-spacing'));

  [...layout.children].forEach((child) => {
    if (child.localName !== 'vaadin-form-item') {
      return;
    }

    if (position === 'aside') {
      expect(child.offsetWidth).to.equal(columnWidth + labelWidth + labelSpacing, 'expected labels to be aside');
    } else {
      expect(child.offsetWidth).to.equal(columnWidth, 'expected labels to be above');
    }
  });
}

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
    const DIALOG_PADDING = 80;

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

      it('should start with max number of columns', () => {
        assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
      });

      it('should adjust number of columns based on dialog width', async () => {
        await setViewport({ width: 300 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 3, rows: 2 });

        await setViewport({ width: 200 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });

        await setViewport({ width: 100 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 1, rows: 4 });

        await setViewport({ width: 50 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 1, rows: 4 });

        await setViewport({ width: 200 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });

        await setViewport({ width: 300 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
      });
    });

    describe('labels aside', () => {
      beforeEach(async () => {
        dialog = fixtureSync(`<vaadin-dialog></vaadin-dialog>`);
        dialog.renderer = (root) => {
          root.innerHTML = `
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

      it('should start with max number of columns and labels positioned aside', () => {
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
        assertFormLayoutLabelPosition(layout, { position: 'aside' });
      });

      it('should adjust number of columns and label position based on dialog width', async () => {
        await setViewport({ width: 500 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
        assertFormLayoutLabelPosition(layout, { position: 'aside' });

        await setViewport({ width: 250 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
        assertFormLayoutLabelPosition(layout, { position: 'aside' });

        await setViewport({ width: 200 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
        assertFormLayoutLabelPosition(layout, { position: 'above' });

        await setViewport({ width: 100 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
        assertFormLayoutLabelPosition(layout, { position: 'above' });

        await setViewport({ width: 200 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
        assertFormLayoutLabelPosition(layout, { position: 'above' });

        await setViewport({ width: 250 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
        assertFormLayoutLabelPosition(layout, { position: 'aside' });
        assertFormLayoutLabelPosition(layout, { position: 'aside' });

        await setViewport({ width: 500 + DIALOG_PADDING, height: 768 });
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
        assertFormLayoutLabelPosition(layout, { position: 'aside' });
      });
    });
  });
});
