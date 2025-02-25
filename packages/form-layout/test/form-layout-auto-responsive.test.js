import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-form-layout.js';
import '../src/vaadin-form-item.js';
import '../src/vaadin-form-row.js';

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

describe('form-layout auto responsive', () => {
  let container, layout, fields;

  describe('auto rows', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-form-layout auto-responsive auto-rows>
          <input placeholder="First name">
          <input placeholder="Last Name">
          <input placeholder="Address" hidden>
          <input placeholder="Email">
          <input placeholder="Phone">
        </vaadin-form-layout>
      `);
      await nextFrame();
      fields = [...layout.children];
    });

    it('should add line break after inserted <br>', async () => {
      const br = document.createElement('br');
      layout.insertBefore(br, fields[2]); // Insert before hidden Address field
      await nextFrame();
      expect(getComputedStyle(fields[3]).gridColumnStart).to.equal('1');
    });

    it('should add line break after inserted <vaadin-form-row>', async () => {
      const row = document.createElement('vaadin-form-row');
      row.innerHTML = `
        <input placeholder="Country">
        <input placeholder="City">
      `;
      layout.insertBefore(row, fields[2]); // Insert before hidden Address field
      await nextFrame();
      expect(getComputedStyle(fields[3]).gridColumnStart).to.equal('1');
    });

    it('should remove line break after removed <br>', async () => {
      const br = document.createElement('br');
      layout.insertBefore(br, fields[2]); // Insert before hidden Address field
      await nextFrame();
      layout.removeChild(br);
      await nextFrame();
      expect(getComputedStyle(fields[3]).gridColumnStart).to.equal('auto');
    });

    it('should remove line break after removed <vaadin-form-row>', async () => {
      const row = document.createElement('vaadin-form-row');
      row.innerHTML = `
        <input placeholder="Country">
        <input placeholder="City">
      `;
      layout.insertBefore(row, fields[2]); // Insert before hidden Address field
      await nextFrame();
      layout.removeChild(row);
      await nextFrame();
      expect(getComputedStyle(fields[3]).gridColumnStart).to.equal('auto');
    });

    it('should maintain line break after <br> when fields visibility changes', async () => {
      const br = document.createElement('br');
      layout.insertBefore(br, fields[2]);
      await nextFrame();

      fields[2].hidden = false;
      await nextFrame();
      expect(getComputedStyle(fields[2]).gridColumnStart).to.equal('1');
      expect(getComputedStyle(fields[3]).gridColumnStart).to.equal('auto');

      fields[2].hidden = true;
      await nextFrame();
      expect(getComputedStyle(fields[2]).gridColumnStart).to.equal('auto');
      expect(getComputedStyle(fields[3]).gridColumnStart).to.equal('1');
    });

    it('should maintain line break after <vaadin-form-row> when fields visibility changes', async () => {
      const row = document.createElement('vaadin-form-row');
      row.innerHTML = `
        <input placeholder="Country">
        <input placeholder="City">
      `;
      layout.insertBefore(row, fields[2]);
      await nextFrame();

      fields[2].hidden = false;
      await nextFrame();
      expect(getComputedStyle(fields[2]).gridColumnStart).to.equal('1');
      expect(getComputedStyle(fields[3]).gridColumnStart).to.equal('auto');

      fields[2].hidden = true;
      await nextFrame();
      expect(getComputedStyle(fields[2]).gridColumnStart).to.equal('auto');
      expect(getComputedStyle(fields[3]).gridColumnStart).to.equal('1');
    });
  });

  describe('auto rows responsiveness', () => {
    beforeEach(async () => {
      container = fixtureSync(`
        <div style="width: 350px;">
          <vaadin-form-layout
            auto-responsive
            auto-rows
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

    it('should adjust number of columns based on container width', async () => {
      container.style.width = '300px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });

      container.style.width = '200px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });

      container.style.width = '100px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 1, rows: 4 });

      container.style.width = '50px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 1, rows: 4 });

      container.style.width = '200px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });

      container.style.width = '300px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
    });
  });

  describe('labels aside responsiveness', () => {
    beforeEach(async () => {
      container = fixtureSync(`
        <div style="width: 600px;">
          <vaadin-form-layout
            auto-responsive
            auto-rows
            labels-aside
            column-width="100px"
            style="
              --vaadin-form-layout-label-width: 100px;
              --vaadin-form-layout-label-spacing: 50px;
              --vaadin-form-layout-column-spacing: 0px;
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
        </div>`);
      layout = container.firstElementChild;
      await nextFrame();
    });

    it('should start with max number of columns and labels positioned aside', () => {
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
      assertFormLayoutLabelPosition(layout, { position: 'aside' });
    });

    it('should adjust number of columns and label position based on container width', async () => {
      container.style.width = '500px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
      assertFormLayoutLabelPosition(layout, { position: 'aside' });

      container.style.width = '250px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
      assertFormLayoutLabelPosition(layout, { position: 'aside' });

      container.style.width = '200px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
      assertFormLayoutLabelPosition(layout, { position: 'above' });

      container.style.width = '100px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
      assertFormLayoutLabelPosition(layout, { position: 'above' });

      container.style.width = '200px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
      assertFormLayoutLabelPosition(layout, { position: 'above' });

      container.style.width = '250px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 1, rows: 4 });
      assertFormLayoutLabelPosition(layout, { position: 'aside' });

      container.style.width = '500px';
      await nextResize(layout);
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
      assertFormLayoutLabelPosition(layout, { position: 'aside' });
    });
  });
});
