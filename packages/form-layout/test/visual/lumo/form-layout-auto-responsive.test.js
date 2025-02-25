import { nextFrame } from '@vaadin/testing-helpers';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-form-layout.js';
import '../../../theme/lumo/vaadin-form-item.js';
import '../../../theme/lumo/vaadin-form-row.js';

describe('form-layout auto responsive', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.border = '10px solid #f3f3f3';
    div.style.maxWidth = '100%';
    div.style.boxSizing = 'border-box';
  });

  describe('basic', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive>
            <input placeholder="First name" />
            <input placeholder="Last Name" />
            <input placeholder="Email" />
            <input placeholder="Phone" />
          </vaadin-form-layout>
        `,
        div,
      );
      await nextFrame();
    });

    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('maxColumns', async () => {
      element.autoRows = true;
      element.maxColumns = 3;
      await visualDiff(div, 'max-columns');
    });

    it('columnWidth', async () => {
      element.autoRows = true;
      element.maxColumns = 2;
      element.columnWidth = '20em';
      await visualDiff(div, 'column-width');
    });
  });

  describe('custom CSS properties - spacing', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows max-columns="2">
            <input placeholder="First name" />
            <input placeholder="Last Name" />
            <input placeholder="Email" />
            <input placeholder="Phone" />
          </vaadin-form-layout>

          <style>
            vaadin-form-layout {
              --vaadin-form-layout-row-spacing: 4em;
              --vaadin-form-layout-column-spacing: 4em;
            }

            input {
              justify-self: stretch;
            }
          </style>
        `,
        div,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'custom-css-properties-spacing');
    });
  });

  describe('explicit rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive>
            <vaadin-form-row>
              <input placeholder="First name" />
              <input placeholder="Last Name" />
            </vaadin-form-row>
            <vaadin-form-row>
              <input placeholder="Address" hidden />
            </vaadin-form-row>
            <vaadin-form-row>
              <input placeholder="Email" />
              <input placeholder="Phone" />
            </vaadin-form-row>
          </vaadin-form-layout>

          <style>
            input {
              justify-self: stretch;
            }
          </style>
        `,
        div,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'explicit-rows');
    });
  });

  describe('auto rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows>
            <input placeholder="First name" />
            <input placeholder="Last Name" />
            <br />
            <input placeholder="Address" hidden />
            <input placeholder="Email" />
            <input placeholder="Phone" />
          </vaadin-form-layout>

          <style>
            input {
              justify-self: stretch;
            }
          </style>
        `,
        div,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'auto-rows');
    });
  });

  describe('auto rows with explicit rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows>
            <vaadin-form-row>
              <input placeholder="First name" />
              <input placeholder="Last Name" />
            </vaadin-form-row>

            <input placeholder="Address" />
          </vaadin-form-layout>

          <style>
            input {
              justify-self: stretch;
            }
          </style>
        `,
        div,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'auto-rows-with-explicit-rows');
    });
  });

  describe('colspan', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows >
            <input placeholder="First name" />
            <input placeholder="Last Name" />
            <input placeholder="Email" />
            <input placeholder="Phone" />
            <input placeholder="Address" colspan="2" />
          </vaadin-form-layout>

          <style>
            input {
              justify-self: stretch;
            }
          </style>
      `,
        div,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'colspan');
    });
  });

  describe('colspan with explicit rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows >
            <vaadin-form-row>
              <input placeholder="First name" />
              <input placeholder="Last Name" />
            </vaadin-form-row>
            <vaadin-form-row>
              <input placeholder="Email" />
              <input placeholder="Phone" />
            </vaadin-form-row>
            <vaadin-form-row>
              <input placeholder="Address" colspan="2"  />
            </vaadin-form-row>
          </vaadin-form-layout>

          <style>
            input {
              justify-self: stretch;
            }
          </style>
      `,
        div,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'colspan-with-explicit-rows');
    });
  });
});
