import { nextFrame, nextResize } from '@vaadin/testing-helpers';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-form-layout.js';
import '../../../theme/lumo/vaadin-form-item.js';
import '../../../theme/lumo/vaadin-form-row.js';

describe('form-layout auto responsive', () => {
  let container, element;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.display = 'inline-block';
    container.style.border = '10px solid #f3f3f3';
    container.style.maxWidth = '100%';
    container.style.boxSizing = 'border-box';
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
        container,
      );
      await nextFrame();
    });

    it('basic', async () => {
      await visualDiff(container, 'basic');
    });

    it('maxColumns', async () => {
      element.autoRows = true;
      element.maxColumns = 2;
      await nextResize(element);
      await visualDiff(container, 'max-columns');
    });

    it('columnWidth', async () => {
      element.autoRows = true;
      element.maxColumns = 2;
      element.columnWidth = '320px';
      await nextResize(element);
      await visualDiff(container, 'column-width');
    });

    it('custom CSS properties', async () => {
      element.autoRows = true;
      element.maxColumns = 2;
      element.style.setProperty('--vaadin-form-layout-row-spacing', '64px');
      element.style.setProperty('--vaadin-form-layout-column-spacing', '64px');
      await nextResize(element);
      await visualDiff(container, 'custom-css-properties');
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
        container,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(container, 'explicit-rows');
    });
  });

  describe('autoRows', () => {
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
        container,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(container, 'auto-rows');
    });
  });

  describe('autoRows with explicit rows', () => {
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
        container,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(container, 'auto-rows-with-explicit-rows');
    });
  });

  describe('colspan', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows max-columns="2">
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
        container,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(container, 'colspan');
    });
  });

  describe('colspan with explicit rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows max-columns="2">
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
        container,
      );
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(container, 'colspan-with-explicit-rows');
    });
  });
});
