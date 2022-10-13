import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/combo-box/theme/lumo/vaadin-combo-box.js';
import '@vaadin/date-picker/theme/lumo/vaadin-date-picker.js';
import '@vaadin/email-field/theme/lumo/vaadin-email-field.js';
import '@vaadin/form-layout/theme/lumo/vaadin-form-item.js';
import '@vaadin/form-layout/theme/lumo/vaadin-form-layout.js';
import '@vaadin/number-field/theme/lumo/vaadin-number-field.js';
import '@vaadin/password-field/theme/lumo/vaadin-password-field.js';
import '@vaadin/select/theme/lumo/vaadin-select.js';
import '@vaadin/text-area/theme/lumo/vaadin-text-area.js';
import '@vaadin/text-field/theme/lumo/vaadin-text-field.js';
import '@vaadin/time-picker/theme/lumo/vaadin-time-picker.js';
import '../../../theme/lumo/vaadin-custom-field.js';

describe('custom-field', () => {
  describe('basic', () => {
    let element, inputs;

    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-custom-field>
          <input type="text" />
          <input type="number" />
        </vaadin-custom-field>
      `);
      inputs = element.querySelectorAll('input');
    });

    it('basic', async () => {
      await visualDiff(element, 'basic-default');
    });

    it('label', async () => {
      element.label = 'Home address';
      await visualDiff(element, 'basic-label');
    });

    it('value', async () => {
      element.label = 'Home address';
      inputs[0].value = 'Foo street';
      inputs[1].value = 42;
      await visualDiff(element, 'basic-value');
    });

    it('disabled', async () => {
      element.disabled = true;
      inputs[0].disabled = true;
      inputs[1].disabled = true;
      await visualDiff(element, 'basic-disabled');
    });

    it('required', async () => {
      element.label = 'Home address';
      element.required = true;
      await visualDiff(element, 'basic-required');
    });

    it('invalid', async () => {
      element.label = 'Home address';
      element.required = true;
      element.invalid = true;
      await visualDiff(element, 'basic-invalid');
    });

    it('error message', async () => {
      element.label = 'Home address';
      element.required = true;
      element.errorMessage = 'foo';
      element.invalid = true;
      await visualDiff(element, 'basic-error-message');
    });

    it('disabled required', async () => {
      element.label = 'Home address';
      element.required = true;
      element.disabled = true;
      inputs[0].disabled = true;
      inputs[1].disabled = true;
      await visualDiff(element, 'basic-disabled-required');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(element, 'basic-helper-text');
    });

    it('helper above field', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'helper-above-field');
      await visualDiff(element, 'helper-above-field');
    });

    it('theme-whitespace', async () => {
      element.setAttribute('theme', 'whitespace');
      element.label = 'Label';
      inputs[0].style.display = 'block';
      inputs[1].style.display = 'none';
      await visualDiff(element, 'whitespace-theme');
    });
  });

  describe('alignment', () => {
    let wrapper;

    describe('error message', () => {
      beforeEach(() => {
        wrapper = fixtureSync(`
          <div>
            <vaadin-custom-field invalid error-message="Invalid">
              <vaadin-number-field value="1"></vaadin-number-field>
              <vaadin-password-field value="password"></vaadin-password-field>
            </vaadin-custom-field>
            <vaadin-text-field invalid error-message="Invalid"></vaadin-text-field>
            <vaadin-time-picker value="09:00"></vaadin-time-picker>
          </div>
        `);
      });

      it('error message alignment', async () => {
        await visualDiff(wrapper, 'alignment-error-message');
      });
    });

    describe('label', () => {
      beforeEach(() => {
        wrapper = fixtureSync(`
          <div>
            <vaadin-custom-field label="Custom field">
              <vaadin-select
                value="+358"
                items='[{ "label": "+358" }, { "label": "+46" }, { "label": "+34" }]'
              ></vaadin-select>
              <vaadin-text-field></vaadin-text-field>
            </vaadin-custom-field>
            <vaadin-text-field label="Text field" value="Text"></vaadin-text-field>
            <vaadin-select
              label="Plain select"
              value="Option one"
              items='[{ "label": "Option one" }, { "label": "Option two" }]'
            ></vaadin-select>
          </div>
        `);
      });

      it('label alignment', async () => {
        await visualDiff(wrapper, 'alignment-label');
      });
    });

    describe('label + error message', () => {
      beforeEach(() => {
        wrapper = fixtureSync(`
          <div>
            <vaadin-custom-field label="Custom field" invalid error-message="Invalid">
              <vaadin-email-field value="user@example.com"></vaadin-email-field>
              <vaadin-date-picker value="1980-08-14" clear-button-visible></vaadin-date-picker>
            </vaadin-custom-field>
            <vaadin-number-field label="Number" value="2" invalid error-message="Invalid"></vaadin-number-field>
            <vaadin-date-picker label="Date" invalid error-message="Invalid"></vaadin-date-picker>
          </div>
        `);
      });

      it('label + error message alignment', async () => {
        await visualDiff(wrapper, 'alignment-label-error-message');
      });
    });

    describe('label + helper text', () => {
      beforeEach(() => {
        wrapper = fixtureSync(`
          <div>
            <vaadin-custom-field label="Custom field" helper-text="Helper">
              <vaadin-combo-box value="Combo item" allow-custom-value clear-button-visible></vaadin-combo-box>
              <vaadin-time-picker value="09:00"></vaadin-time-picker>
            </vaadin-custom-field>
            <vaadin-combo-box label="Combo" value="Combo item" allow-custom-value helper-text="Helper"></vaadin-combo-box>
            <vaadin-password-field value="password"></vaadin-password-field>
          </div>
        `);
      });

      it('label + helper text alignment', async () => {
        await visualDiff(wrapper, 'alignment-label-helper-text');
      });
    });
  });

  describe('form-layout', () => {
    let layout;

    describe('label + error message', () => {
      beforeEach(() => {
        layout = fixtureSync(`
          <vaadin-form-layout style="width: 60em">
            <vaadin-text-field label="Text field" invalid error-message="Error"></vaadin-text-field>
            <vaadin-custom-field label="Custom field" invalid error-message="Error">
              <vaadin-text-field></vaadin-text-field>
            </vaadin-custom-field>
          </vaadin-form-layout>
        `);
      });

      it('label in form layout', async () => {
        await visualDiff(layout, 'form-layout-label-error-message');
      });
    });

    describe('form-item', () => {
      beforeEach(() => {
        layout = fixtureSync(`
          <vaadin-form-layout style="width: 60em">
            <vaadin-form-item>
              <label slot="label">Custom field with text area</label>
              <vaadin-custom-field>
                <vaadin-text-area
                  value="Sed libero enim, sed faucibus turpis in eu? Euismod lacinia at quis risus sed vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit, scelerisque in dictum!"
                ></vaadin-text-area>
              </vaadin-custom-field>
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">Text field</label>
              <vaadin-text-field></vaadin-text-field>
            </vaadin-form-item>
          </vaadin-form-layout>
        `);
      });

      it('label in form layout', async () => {
        await visualDiff(layout, 'form-layout-item-text-area');
      });
    });
  });
});
