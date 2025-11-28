import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-date-time-picker.js';

describe('date-time-picker', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>', div);
  });

  describe('default', () => {
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

    it('focused', async () => {
      element.label = 'Label';
      element.focus();
      await visualDiff(div, 'focused');
    });

    it('placeholder', async () => {
      element.datePlaceholder = 'Date';
      element.timePlaceholder = 'Time';
      await visualDiff(div, 'placeholder');
    });

    it('value', async () => {
      element.value = '2019-09-16T15:00';
      await visualDiff(div, 'value');
    });
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('RTL', async () => {
      await visualDiff(div, 'rtl-basic');
    });
  });
});
