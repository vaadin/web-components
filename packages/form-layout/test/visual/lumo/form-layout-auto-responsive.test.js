import { nextFrame } from '@vaadin/testing-helpers';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-form-layout.js';
import '../../../theme/lumo/vaadin-form-item.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-form-layout',
  css`
    :host {
      border: 1px solid red;
    }
  `,
);

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

    it('autoRows', async () => {
      element.autoRows = true;
      await visualDiff(div, 'auto-rows');
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
          <div>
            <style>
              vaadin-form-layout {
                --vaadin-form-layout-row-spacing: 4em;
                --vaadin-form-layout-column-spacing: 4em;
              }

              input {
                justify-self: stretch;
              }
            </style>

            <vaadin-form-layout auto-responsive auto-rows max-columns="2">
              <input placeholder="First name" />
              <input placeholder="Last Name" />
              <input placeholder="Email" />
              <input placeholder="Phone" />
            </vaadin-form-layout>
          </div>
        `,
        div,
      ).lastChild;
      await nextFrame();
    });

    it('basic', async () => {
      await visualDiff(div, 'custom-css-properties-spacing');
    });
  });
});
