import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-list-box/theme/material/vaadin-list-box.js';
import '@vaadin/vaadin-item/theme/material/vaadin-item.js';
import '../../../theme/material/vaadin-select.js';

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
    await visualDiff(div, 'select:basic');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'select:disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'select:readonly');
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, 'select:label');
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'select:placeholder');
  });

  it('value', async () => {
    element.value = 'item 1';
    await visualDiff(div, 'select:value');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'select:required');
  });

  it('error message', async () => {
    element.label = 'Label';
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, 'select:error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'select:helper-text');
  });

  it('prefix slot', async () => {
    const span = document.createElement('span');
    span.setAttribute('slot', 'prefix');
    span.textContent = '$';
    element.appendChild(span);
    await visualDiff(div, 'select:prefix');
  });

  it('opened', async () => {
    div.style.height = '200px';
    div.style.width = '200px';
    element.opened = true;
    await nextFrame();
    await visualDiff(div, 'select:opened');
  });
});
