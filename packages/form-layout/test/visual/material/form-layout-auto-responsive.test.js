import { nextFrame } from '@vaadin/testing-helpers';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-form-layout.js';
import '../../../theme/material/vaadin-form-item.js';
import '../../../theme/material/vaadin-form-row.js';

describe('form-layout auto responsive', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    div.style.maxWidth = '100%';
    div.style.boxSizing = 'border-box';
  });

  describe('basic', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
        <vaadin-form-layout auto-responsive style="border: 1px solid red;">
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
      element.columnWidth = '15em';
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
              border: 1px solid red;
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
            vaadin-form-layout {
              border: 1px solid red;
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
      await visualDiff(div, 'explicit-rows');
    });
  });

  describe('auto rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
        <vaadin-form-layout auto-responsive auto-rows style="border: 1px solid red;">
          <input placeholder="First name" />
          <input placeholder="Last Name" />
          <br />
          <input placeholder="Address" hidden />
          <input placeholder="Email" />
          <input placeholder="Phone" />
        </vaadin-form-layout>
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
        <vaadin-form-layout auto-responsive auto-rows max-columns="3" style="border: 1px solid red;">
          <vaadin-form-row>
            <input placeholder="First name" />
            <input placeholder="Last Name" />
          </vaadin-form-row>

          <input placeholder="Address" />
        </vaadin-form-layout>
      `,
        div,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'auto-rows-with-explicit-rows');
    });
  });
});
