import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-radio-group.js';

describe('radio-group', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';

    element = fixtureSync(
      `
        <vaadin-radio-group>
          <vaadin-radio-button value="a" label="A"></vaadin-radio-button>
          <vaadin-radio-button value="b" label="B"></vaadin-radio-button>
          <vaadin-radio-button value="c" label="C"></vaadin-radio-button>
        </vaadin-radio-group>
      `,
      div,
    );
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'state-basic');
    });

    it('value', async () => {
      element.value = 'a';
      await visualDiff(div, 'state-value');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'state-disabled');
    });

    it('disabled value', async () => {
      element.disabled = true;
      element.value = 'a';
      await visualDiff(div, 'state-disabled-value');
    });

    it('disabled label', async () => {
      element.label = 'Label';
      element.disabled = true;
      await visualDiff(div, 'state-disabled-label');
    });

    it('readonly', async () => {
      element.readonly = true;
      element.value = 'a';
      await visualDiff(div, 'state-readonly');
    });

    it('required', async () => {
      element.label = 'Label';
      element.required = true;
      await visualDiff(div, 'state-required');
    });

    describe('focus', () => {
      it('keyboard focus', async () => {
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus');
      });

      it('readonly focus', async () => {
        element.readonly = true;
        element.value = 'a';
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus-readonly');
      });
    });
  });

  describe('features', () => {
    ['ltr', 'rtl'].forEach((dir) => {
      describe(dir, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it('horizontal', async () => {
          element.setAttribute('theme', 'horizontal');
          await visualDiff(div, `${dir}-horizontal`);
        });

        it('horizontal wrapped', async () => {
          element.setAttribute('theme', 'horizontal');
          element.style.width = '150px';
          await visualDiff(div, `${dir}-horizontal-wrapped`);
        });

        it('error message', async () => {
          element.label = 'Label';
          element.errorMessage = 'This field is required';
          element.required = true;
          element.validate();
          await visualDiff(div, `${dir}-error-message`);
        });

        it('helper text', async () => {
          element.helperText = 'Helper text';
          await visualDiff(div, `${dir}-helper-text`);
        });

        it('helper above field', async () => {
          element.label = 'Label';
          element.helperText = 'Helper text';
          element.setAttribute('theme', 'helper-above-field');
          await visualDiff(div, `${dir}-helper-above-field`);
        });
      });
    });
  });
});
