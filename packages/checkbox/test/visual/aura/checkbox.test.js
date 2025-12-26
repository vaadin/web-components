import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '@vaadin/aura/aura.css';
import '../../../vaadin-checkbox.js';

describe('checkbox', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-checkbox label="Checkbox"></vaadin-checkbox>', div);
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('checked', async () => {
      element.checked = true;
      await visualDiff(div, 'checked');
    });

    it('indeterminate', async () => {
      element.indeterminate = true;
      await visualDiff(div, 'indeterminate');
    });

    it('checked', async () => {
      element.setAttribute('active', '');
      await visualDiff(div, 'active');
    });

    describe('disabled', () => {
      beforeEach(() => {
        element.disabled = true;
      });

      it('basic', async () => {
        await visualDiff(div, 'disabled');
      });

      it('checked', async () => {
        element.checked = true;
        await visualDiff(div, 'disabled-checked');
      });

      it('indeterminate', async () => {
        element.indeterminate = true;
        await visualDiff(div, 'disabled-indeterminate');
      });
    });

    describe('readonly', () => {
      beforeEach(() => {
        element.readonly = true;
      });

      it('basic', async () => {
        await visualDiff(div, 'readonly');
      });

      it('checked', async () => {
        element.checked = true;
        await visualDiff(div, 'readonly-checked');
      });

      it('indeterminate', async () => {
        element.indeterminate = true;
        await visualDiff(div, 'readonly-indeterminate');
      });
    });
  });
});
