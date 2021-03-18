import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-date-time-picker.js';

describe('date-time-picker', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>', div);
  });

  describe('default', () => {
    it('basic', async () => {
      await visualDiff(div, 'date-time-picker:basic');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'date-time-picker:disabled');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'date-time-picker:readonly');
    });

    it('label', async () => {
      element.label = 'Label';
      await visualDiff(div, 'date-time-picker:label');
    });

    it('placeholder', async () => {
      element.datePlaceholder = 'Date';
      element.timePlaceholder = 'Time';
      await visualDiff(div, 'date-time-picker:placeholder');
    });

    it('value', async () => {
      element.value = '2019-09-16T15:00';
      await visualDiff(div, 'date-time-picker:value');
    });

    it('required', async () => {
      element.label = 'Label';
      element.required = true;
      await visualDiff(div, 'date-time-picker:required');
    });

    it('error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'date-time-picker:error-message');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(div, 'date-time-picker:helper-text');
    });
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('RTL', async () => {
      await visualDiff(div, 'date-time-picker:rtl-basic');
    });

    it('RTL error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'date-time-picker:rtl-error-message');
    });
  });
});
