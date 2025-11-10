import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-checkbox-group.js';

describe('checkbox-group', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';

    element = fixtureSync(
      `
        <vaadin-checkbox-group>
          <vaadin-checkbox value="a" label="A"></vaadin-checkbox>
          <vaadin-checkbox value="b" label="B"></vaadin-checkbox>
          <vaadin-checkbox value="c" label="C"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `,
      div,
    );
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'state-basic');
    });

    it('value', async () => {
      element.value = ['a', 'c'];
      await visualDiff(div, 'state-value');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'state-disabled');
    });

    it('disabled value', async () => {
      element.disabled = true;
      element.value = ['a', 'c'];
      await visualDiff(div, 'state-disabled-value');
    });

    it('disabled label', async () => {
      element.label = 'Label';
      element.disabled = true;
      await visualDiff(div, 'state-disabled-label');
    });

    it('readonly', async () => {
      element.readonly = true;
      element.value = ['a', 'c'];
      await visualDiff(div, 'state-readonly');
    });

    describe('focus', () => {
      it('keyboard focus', async () => {
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus');
      });

      it('readonly focus', async () => {
        element.readonly = true;
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
      });
    });
  });
});
