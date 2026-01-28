import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
import '../../../vaadin-combo-box.js';

describe('combo-box', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-combo-box></vaadin-combo-box>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('value', async () => {
    element.allowCustomValue = true;
    element.value = 'value';
    await visualDiff(div, 'value');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'readonly');
  });

  describe('opened', () => {
    beforeEach(() => {
      div.style.height = '200px';
      div.style.width = '200px';
      element.items = ['Foo', 'Bar', 'Baz'];
      element.open();
    });

    it('opened', async () => {
      await visualDiff(div, 'opened');
    });

    it('opened value', async () => {
      element.value = 'Foo';
      await visualDiff(div, 'opened-value');
    });
  });
});
