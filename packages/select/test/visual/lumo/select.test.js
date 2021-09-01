import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/vaadin-list-box/theme/lumo/vaadin-list-box.js';
import '@vaadin/vaadin-item/theme/lumo/vaadin-item.js';
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
    await visualDiff(div, `${import.meta.url}_basic`);
  });

  it('focus-ring', async () => {
    await sendKeys({ press: 'Tab' });

    await visualDiff(div, `${import.meta.url}_focus-ring`);
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, `${import.meta.url}_disabled`);
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, `${import.meta.url}_readonly`);
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, `${import.meta.url}_label`);
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, `${import.meta.url}_placeholder`);
  });

  it('value', async () => {
    element.value = 'item 1';
    await visualDiff(div, `${import.meta.url}_value`);
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, `${import.meta.url}_required`);
  });

  it('error message', async () => {
    element.label = 'Label';
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, `${import.meta.url}_error-message`);
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, `${import.meta.url}_helper-text`);
  });

  it('prefix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'prefix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, `${import.meta.url}_prefix`);
  });

  it('opened', async () => {
    div.style.height = '200px';
    div.style.width = '200px';
    await sendKeys({ press: 'Tab' });
    element.opened = true;
    await nextFrame();
    await visualDiff(div, `${import.meta.url}_opened`);
  });

  it('align-center', async () => {
    element.value = 'item 1';
    element.setAttribute('theme', 'align-center');
    await visualDiff(div, `${import.meta.url}_align-center`);
  });

  it('align-right', async () => {
    element.value = 'item 1';
    element.setAttribute('theme', 'align-right');
    await visualDiff(div, `${import.meta.url}_align-right`);
  });
});
