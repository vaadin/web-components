import { nextResize } from '@vaadin/testing-helpers';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-form-layout.js';
import '../../../theme/lumo/vaadin-form-item.js';
import '../../../theme/lumo/vaadin-form-row.js';

const DEFAULT_COLUMN_WIDTH = '12em';

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
      await nextResize(element);
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

    it('expandFields', async () => {
      element.expandFields = true;
      await nextResize(element);
      await visualDiff(container, 'expand-fields');
    });

    it('custom CSS properties', async () => {
      element.autoRows = true;
      element.maxColumns = 2;
      element.style.setProperty('--vaadin-field-default-width', '320px');
      element.style.setProperty('--vaadin-form-layout-row-spacing', '64px');
      element.style.setProperty('--vaadin-form-layout-column-spacing', '64px');
      await nextResize(element);
      await visualDiff(container, 'custom-css-properties');
    });
  });

  describe('minColumns', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout
            auto-responsive
            auto-rows
            column-width="100px"
            min-columns="2"
            max-columns="3"
          >
            <vaadin-form-item>
              <label slot="label">Field 1</label>
              <input />
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">Field 2</label>
              <input />
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">Field 3</label>
              <input />
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">Field 4</label>
              <input />
            </vaadin-form-item>
          </vaadin-form-layout>
        `,
        container,
      );
      await nextResize(element);
    });

    it('wide container (space for 3 columns)', async () => {
      await visualDiff(container, 'min-columns-wide-container');
    });

    it('medium container (space for 2 columns)', async () => {
      container.style.width = '250px';
      await nextResize(element);
      await visualDiff(container, 'min-columns-medium-container');
    });

    it('narrow container (space for 1 column only)', async () => {
      container.style.width = '100px';
      await nextResize(element);
      await visualDiff(container, 'min-columns-narrow-container');
    });

    it('labelsAside', async () => {
      element.labelsAside = true;
      container.style.width = '800px';
      await nextResize(element);
      await visualDiff(container, 'min-columns-labels-aside');
    });

    it('labelsAside with narrow container', async () => {
      element.labelsAside = true;
      container.style.width = '200px';
      await nextResize(element);
      await visualDiff(container, 'min-columns-labels-aside-narrow-container');
    });
  });

  describe('explicit rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive expand-fields>
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
        `,
        container,
      );
      await nextResize(element);
    });

    it('default', async () => {
      await visualDiff(container, 'explicit-rows');
    });
  });

  describe('autoRows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows expand-fields>
            <input placeholder="First name" />
            <input placeholder="Last Name" />
            <br />
            <input placeholder="Address" hidden />
            <input placeholder="Email" />
            <input placeholder="Phone" />
          </vaadin-form-layout>
        `,
        container,
      );
      await nextResize(element);
    });

    it('default', async () => {
      await visualDiff(container, 'auto-rows');
    });
  });

  describe('autoRows with explicit rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows expand-fields>
            <vaadin-form-row>
              <input placeholder="First name" />
              <input placeholder="Last Name" />
            </vaadin-form-row>

            <input placeholder="Address" />
          </vaadin-form-layout>
        `,
        container,
      );
      await nextResize(element);
    });

    it('default', async () => {
      await visualDiff(container, 'auto-rows-with-explicit-rows');
    });
  });

  describe('form items', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows>
            <vaadin-form-item>
              <label slot="label">A short label</label>
              <input />
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">A long label that wraps across multiple lines</label>
              <input />
            </vaadin-form-item>
          </vaadin-form-layout>
        `,
        container,
      );
      await nextResize(element);
    });

    it('default', async () => {
      await visualDiff(container, 'form-items');
    });

    it('expandFields', async () => {
      element.expandFields = true;
      await nextResize(element);
      await visualDiff(container, 'form-items-expand-fields');
    });

    it('expandColumns in narrow container', async () => {
      container.style.width = `calc(${DEFAULT_COLUMN_WIDTH} + 6em)`;
      element.expandFields = true;
      element.expandColumns = true;
      await nextResize(element);
      await visualDiff(container, 'form-items-expand-columns-narrow-container');
    });

    it('expandColumns in wide container', async () => {
      container.style.width = '50em';
      element.expandFields = true;
      element.expandColumns = true;
      await nextResize(element);
      await visualDiff(container, 'form-items-expand-columns-wide-container');
    });

    it('labelsAside in narrow container', async () => {
      container.style.width = `calc(${DEFAULT_COLUMN_WIDTH} + 6em)`;
      element.expandFields = true;
      element.labelsAside = true;
      await nextResize(element);
      await visualDiff(container, 'form-items-labels-aside-narrow-container');
    });

    it('labelsAside in wide container', async () => {
      container.style.width = '50em';
      element.expandFields = true;
      element.labelsAside = true;
      await nextResize(element);
      await visualDiff(container, 'form-items-labels-aside-wide-container');
    });

    it('labelsAside + expandColumns in narrow container', async () => {
      container.style.width = `calc(${DEFAULT_COLUMN_WIDTH} + 6em)`;
      element.expandFields = true;
      element.labelsAside = true;
      element.expandColumns = true;
      await nextResize(element);
      await visualDiff(container, 'form-items-labels-aside-expand-columns-narrow-container');
    });

    it('labelsAside + expandColumns in wide container', async () => {
      container.style.width = '50em';
      element.expandFields = true;
      element.labelsAside = true;
      element.expandColumns = true;
      await nextResize(element);
      await visualDiff(container, 'form-items-labels-aside-expand-columns-wide-container');
    });

    it('labelsAside + custom CSS properties', async () => {
      element.expandFields = true;
      element.labelsAside = true;
      element.style.setProperty('--vaadin-form-layout-label-width', '200px');
      element.style.setProperty('--vaadin-form-layout-label-spacing', '60px');
      await nextResize(element);
      await visualDiff(container, 'form-items-labels-aside-custom-css-properties');
    });
  });

  describe('form items with explicit rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive>
            <vaadin-form-row>
              <vaadin-form-item>
                <label slot="label">First name</label>
                <input />
              </vaadin-form-item>
              <vaadin-form-item>
                <label slot="label">Last name</label>
                <input />
              </vaadin-form-item>
            </vaadin-form-row>

            <vaadin-form-row>
              <vaadin-form-item>
                <label slot="label">Email</label>
                <input />
              </vaadin-form-item>
              <vaadin-form-item>
                <label slot="label">Phone</label>
                <input />
              </vaadin-form-item>
            </vaadin-form-row>
          </vaadin-form-layout>
        `,
        container,
      );
      await nextResize(element);
    });

    it('default', async () => {
      await visualDiff(container, 'form-items-with-explicit-rows');
    });

    it('labelsAside', async () => {
      element.labelsAside = true;
      await nextResize(element);
      await visualDiff(container, 'form-items-with-explicit-rows-labels-aside');
    });
  });

  describe('colspan', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows max-columns="2" expand-fields>
            <input placeholder="First name" />
            <input placeholder="Last Name" />
            <input placeholder="Email" />
            <input placeholder="Phone" />
            <input placeholder="Address" colspan="2" />
          </vaadin-form-layout>
        `,
        container,
      );
      await nextResize(element);
    });

    it('default', async () => {
      await visualDiff(container, 'colspan');
    });

    it('colspan in narrow container', async () => {
      container.style.width = `calc(${DEFAULT_COLUMN_WIDTH} + 6em)`;
      await nextResize(element);
      await visualDiff(container, 'colspan-narrow-container');
    });

    it('colspan in wide container', async () => {
      container.style.width = '50em';
      await nextResize(element);
      await visualDiff(container, 'colspan-wide-container');
    });
  });

  describe('colspan with explicit rows', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive auto-rows max-columns="2" expand-fields>
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
      `,
        container,
      );
      await nextResize(element);
    });

    it('default', async () => {
      await visualDiff(container, 'colspan-with-explicit-rows');
    });
  });

  describe('fields with explicit width', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-form-layout auto-responsive column-width="15em">
            <vaadin-form-row>
              <input placeholder="First name" style="width: 10em" />
              <input placeholder="Last Name" style="width: 20em" />
            </vaadin-form-row>
            <vaadin-form-row>
              <vaadin-form-item>
                <label slot="label">Phone</label>
                <input style="width: 10em" />
              </vaadin-form-item>
              <vaadin-form-item>
                <label slot="label">Email</label>
                <input style="width: 20em" />
              </vaadin-form-item>
            </vaadin-form-row>
          </vaadin-form-layout>
        `,
        container,
      );
      await nextResize(element);
    });

    it('default', async () => {
      await visualDiff(container, 'fields-with-explicit-width');
    });

    it('expandFields', async () => {
      element.expandFields = true;
      await nextResize(element);
      await visualDiff(container, 'fields-with-explicit-width-expand-fields');
    });
  });
});
