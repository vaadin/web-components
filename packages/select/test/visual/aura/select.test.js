import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
import '../../../vaadin-select.js';

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

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'placeholder');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'readonly');
  });

  it('opened', async () => {
    div.style.height = '200px';
    div.style.width = '200px';
    await sendKeys({ press: 'Tab' });
    element.opened = true;
    await nextFrame();
    await visualDiff(div, 'opened');
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

    it('opened value', async () => {
      div.style.height = '200px';
      div.style.width = '200px';
      element.value = 'value-1';
      await sendKeys({ press: 'Tab' });
      element.opened = true;
      await nextFrame();
      await visualDiff(div, 'value-opened');
    });
  });
});
