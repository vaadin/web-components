import { nextFrame } from '@vaadin/testing-helpers';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/text-field';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/components/form-layout.css';
import '@vaadin/vaadin-lumo-styles/components/form-item.css';
import '@vaadin/vaadin-lumo-styles/components/text-field.css';
import '../../../vaadin-form-layout.js';
import '../../../vaadin-form-item.js';

describe('form-layout', () => {
  let element;

  describe('basic', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-form-layout>
          <vaadin-form-item>
            <label slot="label">First Name</label>
            <input class="full-width" value="Jane" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Last Name</label>
            <input class="full-width" value="Doe" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Email</label>
            <input class="full-width" value="jane.doe@example.com" />
          </vaadin-form-item>

          <vaadin-form-item>
            <span slot="label">Date of Birth</span>
            <input placeholder="YYYY" size="4" /> - <input placeholder="MM" size="2" /> -
            <input placeholder="DD" size="2" /><br />
            <em>Example: 1900-01-01</em>
          </vaadin-form-item>

          <vaadin-form-item colspan="2">
            <label slot="label">Conference Abstract</label>
            <textarea rows="6" class="full-width" style="display: inline-flex; vertical-align: top"></textarea>
          </vaadin-form-item>

          <vaadin-form-item>
            <input type="checkbox" />
            Subscribe to our Newsletter
          </vaadin-form-item>
        </vaadin-form-layout>
      `);
    });

    it('basic', async () => {
      await visualDiff(element, 'basic');
    });
  });

  describe('new line', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-form-layout>
          <vaadin-form-item>
            <label slot="label">Email</label>
            <input class="full-width" value="jane.doe@example.com" />
          </vaadin-form-item>
          <br />
          <vaadin-form-item>
            <label slot="label">Confirm Email</label>
            <input class="full-width" value="jane.doe@example.com" />
          </vaadin-form-item>
        </vaadin-form-layout>
      `);
    });

    it('new line', async () => {
      await visualDiff(element, 'br');
    });
  });

  describe('colspan', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-form-layout>
          <vaadin-form-item colspan="2">
            <label slot="label">Address</label>
            <input class="full-width" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">First Name</label>
            <input class="full-width" value="Jane" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Last Name</label>
            <input class="full-width" value="Doe" />
          </vaadin-form-item>
        </vaadin-form-layout>
      `);
    });

    it('colspan', async () => {
      await visualDiff(element, 'colspan');
    });
  });

  describe('colspan alignment', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-form-layout style="width: 645px; padding-inline: 2em;">
          <vaadin-form-item colspan="2">
            <label slot="label">Address</label>
            <vaadin-text-field class="full-width"></vaadin-text-field>
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">First Name</label>
            <vaadin-text-field class="full-width"></vaadin-text-field>
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Last Name</label>
            <vaadin-text-field class="full-width"></vaadin-text-field>
          </vaadin-form-item>
        </vaadin-form-layout>
      `);
    });

    it('colspan alignment', async () => {
      await visualDiff(element, 'colspan-alignment');
    });
  });

  describe('CSS properties', () => {
    let div;

    beforeEach(() => {
      div = fixtureSync(`
        <div>
          <style>
            vaadin-form-layout {
              --vaadin-form-layout-column-spacing: 4em;
            }

            vaadin-form-item {
              --vaadin-form-item-label-width: 6em;
              --vaadin-form-item-label-spacing: 1em;
              --vaadin-form-item-row-spacing: 1.25em;
            }
          </style>
          <vaadin-form-layout id="tests">
            <vaadin-form-item>
              <label slot="label">First Name</label>
              <input class="full-width" value="Jane" />
            </vaadin-form-item>

            <vaadin-form-item>
              <label slot="label">Last Name</label>
              <input class="full-width" value="Doe" />
            </vaadin-form-item>

            <vaadin-form-item>
              <label slot="label">Email</label>
              <input class="full-width" value="jane.doe@example.com" />
            </vaadin-form-item>
          </vaadin-form-layout>
        </div>
      `);
      element = div.querySelector('vaadin-form-layout');
    });

    it('CSS properties', async () => {
      await visualDiff(element, 'css-properties');
    });
  });

  describe('responsiveSteps', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-form-layout
          responsive-steps='[
            {"minWidth": 0, "columns": 2},
            {"minWidth": "640px", "columns": 3}
          ]'
          >
          <vaadin-form-item>
            <label slot="label">First Name</label>
            <input class="full-width" value="Jane" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Last Name</label>
            <input class="full-width" value="Doe" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Email</label>
            <input class="full-width" value="jane.doe@example.com" />
          </vaadin-form-item>
        </vaadin-form-layout>
      `);
    });

    it('responsiveSteps', async () => {
      await visualDiff(element, 'responsive-steps');
    });
  });

  describe('single column', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-form-layout
          responsive-steps='[
            {"minWidth": 0, "columns": 1, "labelsPosition": "top"},
            {"minWidth": "30em", "columns": 1}
          ]'
          >
          <vaadin-form-item>
            <label slot="label">First Name</label>
            <input class="full-width" value="Jane" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Last Name</label>
            <input class="full-width" value="Doe" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Email</label>
            <input class="full-width" value="jane.doe@example.com" />
          </vaadin-form-item>
          </vaadin-form-layout>
      `);
    });

    it('single column', async () => {
      await visualDiff(element, 'single-column');
    });
  });

  describe('required indicator', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <vaadin-form-layout>
          <vaadin-form-item>
            <label slot="label">First Name</label>
            <input required value="Jane" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Last Name</label>
            <input required />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Email</label>
            <input required value="jane.doe@example.com" />
          </vaadin-form-item>
        </vaadin-form-layout>
      `);

      await nextFrame();

      // Make the second input validate so that it becomes invalid
      element.querySelectorAll('input')[1].dispatchEvent(new CustomEvent('change'));
    });

    it('required indicator - labels aside', async () => {
      await visualDiff(element, 'required-indicator-labels-aside');
    });

    it('required-indicator - labels on top', async () => {
      element.responsiveSteps = element.responsiveSteps.map((step) => {
        step.labelsPosition = 'top';
        return step;
      });
      await visualDiff(element, 'required-indicator-labels-on-top');
    });
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('container overflow', () => {
        beforeEach(() => {
          element = fixtureSync(`
            <div style="display: inline-block; padding: 10px">
              <style>
                vaadin-form-layout > div:nth-child(even) {
                  background: var(--lumo-contrast-10pct);
                }

                vaadin-form-layout > div:nth-child(odd) {
                  background: var(--lumo-contrast-50pct);
                }
              </style>

              <div style="width: 300px; overflow: auto; border: 1px solid;">
                <vaadin-form-layout responsive-steps='[{"columns": 3}]'>
                  <div>1/3</div>
                  <div>1/3</div>
                  <div>1/3</div>
                  <br>
                  <div style="display: none;">hidden</div>
                  <div colspan="2">2/3</div>
                  <div style="display: none;">hidden</div>
                  <br>
                  <div>1/3</div>
                  <div colspan="2">2/3</div>
                  <div colspan="2">2/3</div>
                  <div>1/3</div>
                  <div colspan="3">3/3</div>
                </vaadin-form-layout>
              </div>
            </div>
          `);
        });

        it('basic', async () => {
          await visualDiff(element, `${dir}-container-overflow`);
        });
      });
    });
  });
});
