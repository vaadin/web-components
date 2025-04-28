import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '@vaadin/item/src/vaadin-lit-item.js';
import '@vaadin/list-box/src/vaadin-lit-list-box.js';
import '../../../src/vaadin-lit-select.js';

describe('select', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-select></vaadin-select>', div);
    element.items = [
      { label: 'item 1', value: 'value-1' },
      { label: 'item 2', value: 'value-2' },
      { label: 'item 3', value: 'value-3' },
    ];
  });

  describe('states', () => {
    it('basic', async () => {
      await visualDiff(div, 'state-basic');
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

    it('required', async () => {
      element.label = 'Label';
      element.required = true;
      await visualDiff(div, 'state-required');
    });

    it('focus', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'state-focus');
    });

    it('opened', async () => {
      div.style.height = '200px';
      div.style.width = '200px';
      await sendKeys({ press: 'Tab' });
      element.opened = true;
      await nextFrame();
      await visualDiff(div, 'state-opened');
    });
  });

  describe('value', () => {
    it('value', async () => {
      element.value = 'value-1';
      await visualDiff(div, 'value');
    });

    it('disabled value', async () => {
      element.disabled = true;
      element.value = 'value-1';
      await visualDiff(div, 'value-disabled');
    });

    it('overflow', async () => {
      element.renderer = (root) => {
        root.innerHTML = `
          <vaadin-list-box>
            <vaadin-item value="long">Very long item text content</vaadin-item>
          </vaadin-list-box>
        `;
      };
      element.value = 'long';
      await visualDiff(div, 'value-overflow');
    });

    it('multiline', async () => {
      element.renderer = (root) => {
        root.innerHTML = `
          <vaadin-list-box>
            <vaadin-item value="custom">
              <div>
                Line 1
                <br>
                Line 2
              </div>
            </vaadin-item>
          </vaadin-list-box>
        `;
      };
      element.value = 'custom';
      await visualDiff(div, 'value-multiline');
    });
  });

  describe('features', () => {
    it('error message', async () => {
      element.label = 'Label';
      element.errorMessage = 'This field is required';
      element.required = true;
      element.validate();
      await visualDiff(div, 'feature-error-message');
    });

    it('helper text', async () => {
      element.helperText = 'Helper text';
      await visualDiff(div, 'feature-helper-text');
    });

    it('helper above field', async () => {
      element.label = 'Label';
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'helper-above-field');
      await visualDiff(div, 'feature-helper-above-field');
    });

    it('prefix', async () => {
      const span = document.createElement('span');
      span.setAttribute('slot', 'prefix');
      span.textContent = '$';
      element.appendChild(span);
      await visualDiff(div, 'feature-prefix');
    });
  });
});
