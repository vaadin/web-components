import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-form-layout.js';
import '../src/vaadin-form-item.js';
import '../src/vaadin-form-row.js';
import { assertFormLayoutGrid, assertFormLayoutLabelPosition } from './helpers.js';

describe('form-layout auto responsive', () => {
  let container, layout, fields;

  describe('column width', () => {
    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-form-layout auto-responsive>
          <input placeholder="First name">
          <input placeholder="Last name">
        </vaadin-form-layout>
      `);
    });

    it('should update --_column-width on columnWidth change', () => {
      layout.columnWidth = '100px';
      expect(layout.style.getPropertyValue('--_column-width')).to.equal('100px');
      layout.columnWidth = null;
      expect(layout.style.getPropertyValue('--_column-width')).to.equal('');
    });
  });

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
      await nextResize(layout);
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
            <input placeholder="Address">
          </vaadin-form-layout>
        </div>`);
      layout = container.firstElementChild;
      await nextResize(layout);
    });

    it('should start with max number of columns', () => {
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
    });

    it('should adjust number of columns based on container width', async () => {
      layout.minColumns = 2;
      layout.maxColumns = 4;
      await nextResize(layout);

      const breakpoints = [
        { width: '500px', columns: 4, rows: 2 },
        { width: '300px', columns: 3, rows: 2 },
        { width: '200px', columns: 2, rows: 3 },
        { width: '100px', columns: 2, rows: 3 },
        { width: '200px', columns: 2, rows: 3 },
        { width: '300px', columns: 3, rows: 2 },
        { width: '500px', columns: 4, rows: 2 },
      ];

      for (const { width, columns, rows } of breakpoints) {
        container.style.width = width;
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns, rows });
      }
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
      await nextResize(layout);
    });

    it('should start with max number of columns and labels positioned aside', () => {
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
      assertFormLayoutLabelPosition(layout, { position: 'aside' });
    });

    it('should adjust number of columns and label position based on container width', async () => {
      const breakpoints = [
        { width: '500px', columns: 2, rows: 2, labelPosition: 'aside' },
        { width: '250px', columns: 1, rows: 4, labelPosition: 'aside' },
        { width: '200px', columns: 2, rows: 2, labelPosition: 'above' },
        { width: '100px', columns: 1, rows: 4, labelPosition: 'above' },
        { width: '200px', columns: 2, rows: 2, labelPosition: 'above' },
        { width: '250px', columns: 1, rows: 4, labelPosition: 'aside' },
        { width: '500px', columns: 2, rows: 2, labelPosition: 'aside' },
      ];

      for (const { width, columns, rows, labelPosition } of breakpoints) {
        container.style.width = width;
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns, rows });
        assertFormLayoutLabelPosition(layout, { position: labelPosition });
      }
    });
  });

  describe('colspan', () => {
    let container;
    beforeEach(async () => {
      container = fixtureSync(`
        <div>
          <vaadin-form-layout auto-responsive auto-rows>
            <input placeholder="First name">
            <input placeholder="Last Name">
            <input placeholder="Email">
            <input placeholder="Phone">
            <input placeholder="Address" colspan="2">
          </vaadin-form-layout>
        </div>
      `);
      layout = container.firstElementChild;
      await nextResize(layout);
    });

    it('should make element with colspan take the right amount of columns', () => {
      expect(getComputedStyle(layout.children[4]).gridColumnEnd).to.equal('span 2');
    });

    it('should adjust colspan when container size changes', async () => {
      container.style.width = '100px';
      await nextResize(layout);
      expect(getComputedStyle(layout.children[4]).gridColumnEnd).to.equal('span 1');
      container.style.width = '500px';
      await nextResize(layout);
      expect(getComputedStyle(layout.children[4]).gridColumnEnd).to.equal('span 2');
    });

    it('should be able to define colspan with data-colspan attribute', async () => {
      layout.children[2].setAttribute('data-colspan', '3');
      await nextFrame();
      expect(getComputedStyle(layout.children[2]).gridColumnEnd).to.equal('span 3');
    });
  });

  describe('explicit rows', () => {
    let rows;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-form-layout auto-responsive style="width: 1024px; height: 768px;">
          <vaadin-form-row>
            <input placeholder="First name" />
            <input placeholder="Last name" />
          </vaadin-form-row>
          <vaadin-form-row>
            <input placeholder="Address" />
          </vaadin-form-row>
        </vaadin-form-layout>
      `);
      await nextResize(layout);
      rows = [...layout.children];
    });

    it('should update layout after adding a field to a row', async () => {
      const newField = document.createElement('input');
      // There is a Safari bug that leads to incorrect calculation for baseline alignment of empty inputs
      newField.placeholder = 'Middle name';
      rows[0].appendChild(newField);
      await nextFrame();
      assertFormLayoutGrid(layout, { columns: 3, rows: 2 });
    });

    it('should update layout after removing a field from a row', async () => {
      const newField = document.createElement('input');
      rows[0].appendChild(newField);
      await nextFrame();
      rows[0].removeChild(newField);
      await nextFrame();
      assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
    });

    it('should update layout after adding colspan on a field', async () => {
      rows[1].children[0].setAttribute('colspan', '2');
      await nextFrame();
      expect(getComputedStyle(rows[1].children[0]).gridColumnEnd).to.equal('span 2');
    });
  });
});
