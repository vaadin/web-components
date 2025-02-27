import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-form-layout.js';
import '../src/vaadin-form-row.js';
import { assertFormLayoutGrid } from './helpers.js';

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

    it('should adjust number of columns based on container width', async () => {
      const breakpoints = [
        { width: '300px', columns: 3, rows: 2 },
        { width: '200px', columns: 2, rows: 2 },
        { width: '100px', columns: 1, rows: 4 },
        { width: '200px', columns: 2, rows: 2 },
        { width: '300px', columns: 3, rows: 2 },
      ];

      for (const { width, columns, rows } of breakpoints) {
        container.style.width = width;
        await nextResize(layout);
        assertFormLayoutGrid(layout, { columns, rows });
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
      await nextFrame();
    });

    it('should make element with colspan take the right amount of columns', () => {
      expect(getComputedStyle(layout.children[4]).gridColumnEnd).to.equal('span 2');
    });

    it('should cap colspan if the layout get smaller', async () => {
      container.style.width = '100px';
      await nextResize(layout);
      expect(getComputedStyle(layout.children[4]).gridColumnEnd).to.equal('span 1');
    });

    it('should be able to define colspan with data-colspan attribute', async () => {
      layout.children[2].setAttribute('data-colspan', '3');
      await nextFrame();
      expect(getComputedStyle(layout.children[2]).gridColumnEnd).to.equal('span 3');
    });
  });

  describe('max columns', () => {
    describe('default', () => {
      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-form-layout
            auto-responsive
            auto-rows
            column-width="10em"
            style="--vaadin-form-layout-column-spacing: 0px;"
          >
            <input placeholder="First name">
            <input placeholder="Last Name">
            <input placeholder="Email">
            <input placeholder="Phone">
          </vaadin-form-layout>
        `);
        await nextFrame();
      });

      it('should start with max number of columns', () => {
        assertFormLayoutGrid(layout, { columns: 4, rows: 1 });
      });

      it('should account for line-breaks when calculating max columns', async () => {
        const br = document.createElement('br');
        layout.insertBefore(br, layout.children[2]);
        await nextFrame();
        assertFormLayoutGrid(layout, { columns: 2, rows: 2 });
      });
    });

    describe('explicity rows', () => {
      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-form-layout
            auto-responsive
            max-columns="2"
            column-width="10em" 
            style="--vaadin-form-layout-column-spacing: 0px;"
          >
            <vaadin-form-row>
              <input placeholder="First name">
              <input placeholder="Last Name">
            </vaadin-form-row>
            <vaadin-form-row>
              <input placeholder="Email" colspan="2">
              <input placeholder="Phone">
            </vaadin-form-row>
          </vaadin-form-layout>

          <style>
            input {
              justify-self: stretch;
            }
          </style>
        `);
        await nextFrame();
      });

      it('should respect max columns attribute', () => {
        assertFormLayoutGrid(layout, { columns: 2, rows: 3 });
      });

      it('should calculate max columns based on explicit rows', async () => {
        layout.maxColumns = 10;
        await nextFrame();
        expect(getComputedStyle(layout.$.layout).getPropertyValue('--_max-columns')).to.equal('3');
      });

      it('should account for line-breaks when calculating max columns', async () => {
        layout.maxColumns = 10;
        const br = document.createElement('br');
        layout.insertBefore(br, layout.children[2]);
        const input = document.createElement('input');
        input.setAttribute('colspan', '4');
        layout.insertBefore(input, layout.children[2]);
        await nextFrame();
        expect(getComputedStyle(input).gridColumnEnd).to.equal('span 4');
      });
    });
  });
});
