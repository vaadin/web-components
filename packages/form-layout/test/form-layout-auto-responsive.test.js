import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-form-layout.js';
import '../src/vaadin-form-row.js';

function assertFormLayoutGrid(layout, { columns, rows }) {
  const children = [...layout.children];
  expect(new Set(children.map((child) => child.offsetLeft)).size).to.equal(columns);
  expect(new Set(children.map((child) => child.offsetTop)).size).to.equal(rows);
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
      expect(fields[3].style.getPropertyValue('--_column-start')).to.equal('1');
    });

    it('should add line break after inserted <vaadin-form-row>', async () => {
      const row = document.createElement('vaadin-form-row');
      row.innerHTML = `
        <input placeholder="Country">
        <input placeholder="City">
      `;
      layout.insertBefore(row, fields[2]); // Insert before hidden Address field
      await nextFrame();
      expect(fields[3].style.getPropertyValue('--_column-start')).to.equal('1');
    });

    it('should remove line break after removed <br>', async () => {
      const br = document.createElement('br');
      layout.insertBefore(br, fields[2]); // Insert before hidden Address field
      await nextFrame();
      layout.removeChild(br);
      await nextFrame();
      expect(fields[3].style.getPropertyValue('--_column-start')).to.be.empty;
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
      expect(fields[3].style.getPropertyValue('--_column-start')).to.be.empty;
    });

    it('should maintain line break after <br> when fields visibility changes', async () => {
      const br = document.createElement('br');
      layout.insertBefore(br, fields[2]);
      await nextFrame();

      fields[2].hidden = false;
      await nextFrame();
      expect(fields[2].style.getPropertyValue('--_column-start')).to.equal('1');
      expect(fields[3].style.getPropertyValue('--_column-start')).to.be.empty;

      fields[2].hidden = true;
      await nextFrame();
      expect(fields[2].style.getPropertyValue('--_column-start')).to.be.empty;
      expect(fields[3].style.getPropertyValue('--_column-start')).to.equal('1');
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
      expect(fields[2].style.getPropertyValue('--_column-start')).to.equal('1');
      expect(fields[3].style.getPropertyValue('--_column-start')).to.be.empty;

      fields[2].hidden = true;
      await nextFrame();
      expect(fields[2].style.getPropertyValue('--_column-start')).to.be.empty;
      expect(fields[3].style.getPropertyValue('--_column-start')).to.equal('1');
    });
  });

  describe('responsiveness', () => {
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
