import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/item/theme/lumo/vaadin-item.js';
import '@vaadin/list-box/theme/lumo/vaadin-list-box.js';
import '../../not-animated-styles.js';
import '../../../theme/lumo/vaadin-select.js';

describe('select', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-select></vaadin-select>', div);
    element.renderer = (root) => {
      root.innerHTML = `
        <vaadin-list-box>
          <vaadin-item>item 1</vaadin-item>
          <vaadin-item>item 2</vaadin-item>
          <vaadin-item>item 3</vaadin-item>
        </vaadin-list-box>
      `;
    };
    await nextFrame();
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('focus-ring', async () => {
    await sendKeys({ press: 'Tab' });

    await visualDiff(div, 'focus-ring');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('readonly', async () => {
    element.value = 'item 1';
    element.readonly = true;
    await visualDiff(div, 'readonly');
  });

  it('flex', async () => {
    div.style.display = 'inline-flex';
    div.style.height = '200px';
    await visualDiff(div, 'flex');
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, 'label');
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'placeholder');
  });

  it('label and placeholder', async () => {
    element.label = 'Label';
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'label-and-placeholder');
  });

  it('readonly placeholder', async () => {
    element.placeholder = 'Placeholder';
    element.readonly = true;
    await visualDiff(div, 'readonly-placeholder');
  });

  it('disabled placeholder', async () => {
    element.placeholder = 'Placeholder';
    element.disabled = true;
    await visualDiff(div, 'disabled-placeholder');
  });

  it('value', async () => {
    element.value = 'item 1';
    await visualDiff(div, 'value');
  });

  it('value-overflow', async () => {
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

  it('value-custom', async () => {
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
    await visualDiff(div, 'value-custom');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'required');
  });

  it('invalid', async () => {
    element.invalid = true;
    await visualDiff(div, 'invalid');
  });

  it('error message', async () => {
    element.label = 'Label';
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, 'error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'helper-text');
  });

  it('prefix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'prefix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, 'prefix');
  });

  it('opened', async () => {
    div.style.height = '200px';
    div.style.width = '200px';
    await sendKeys({ press: 'Tab' });
    element.opened = true;
    await nextFrame();
    await visualDiff(div, 'opened');
  });

  it('align-center', async () => {
    element.value = 'item 1';
    element.setAttribute('theme', 'align-center');
    await visualDiff(div, 'align-center');
  });

  it('align-right', async () => {
    element.value = 'item 1';
    element.setAttribute('theme', 'align-right');
    await visualDiff(div, 'align-right');
  });

  it('small', async () => {
    element.value = 'item 1';
    element.setAttribute('theme', 'small');
    await visualDiff(div, 'small');
  });

  it('width', async () => {
    element.style.width = '80px';
    await visualDiff(div, 'width');
  });

  it('width with value', async () => {
    element.style.width = '80px';
    element.value = 'item 1';
    await visualDiff(div, 'width-value');
  });

  it('empty value', async () => {
    // To make sure placeholder styles aren't applied to empty value item
    element.placeholder = 'Placeholder';
    element.renderer = (root) => {
      root.innerHTML = `
        <vaadin-list-box>
          <vaadin-item value="">Empty</vaadin-item>
        </vaadin-list-box>
        `;
    };
    await visualDiff(div, 'empty-value');
  });
});
