import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
import '../../../vaadin-time-picker.js';

describe('time-picker', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-time-picker></vaadin-time-picker>', div);
    element.style.setProperty('--vaadin-time-picker-overlay-max-height', '300px');
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'readonly');
  });

  it('value', async () => {
    element.value = '12:12:12.122';
    await visualDiff(div, 'value');
  });

  describe('opened', () => {
    beforeEach(() => {
      div.style.height = '350px';
      div.style.width = '200px';
    });

    it('opened', async () => {
      element.click();
      await visualDiff(div, 'opened');
    });

    it('opened value', async () => {
      element.value = '05:00';
      element.click();
      await visualDiff(div, 'opened-value');
    });
  });
});
