import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-combo-box.js';

describe('combo-box', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-combo-box></vaadin-combo-box>', div);
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'state-basic');
    });

    it('value', async () => {
      element.allowCustomValue = true;
      element.value = 'value';
      await visualDiff(div, 'state-value');
    });

    it('placeholder', async () => {
      element.placeholder = 'Placeholder';
      await visualDiff(div, 'state-placeholder');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'state-disabled');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'state-readonly');
    });

    describe('focus', () => {
      afterEach(async () => {
        await resetMouse();
        // After tests which use sendKeys() the focus-utils.js -> isKeyboardActive is set to true.
        // Click once here on body to reset it so other tests are not affected by it.
        // An unwanted focus-ring would be shown in other tests otherwise.
        mousedown(document.body);
      });

      it('keyboard focus', async () => {
        await sendKeys({ press: 'Tab' });
        await visualDiff(div, 'state-focus-keyboard');
      });

      it('pointer focus', async () => {
        await sendMouseToElement({ type: 'click', element });
        await visualDiff(div, 'state-focus-pointer');
      });
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

      beforeEach(() => {
        div.style.height = '200px';
        div.style.width = '200px';
        element.items = ['Foo', 'Bar', 'Baz'];
        element.open();
      });

      it(`${dir} opened`, async () => {
        await visualDiff(div, `${dir}-opened`);
      });

      it(`${dir} opened`, async () => {
        element.value = 'Foo';
        await visualDiff(div, `${dir}-opened-value`);
      });

      it(`${dir} loading`, async () => {
        element.loading = true;
        await nextFrame();
        await visualDiff(div, `${dir}-loading`);
      });
    });
  });

  describe('features', () => {
    it('prefix', async () => {
      const span = document.createElement('span');
      span.setAttribute('slot', 'prefix');
      span.textContent = '$';
      element.appendChild(span);
      await visualDiff(div, 'feature-prefix');
    });
  });
});
