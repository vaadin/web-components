import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
import '../../../vaadin-date-picker.js';

describe('date-picker', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-date-picker></vaadin-date-picker>', div);
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
    element.value = '1991-12-20';
    await visualDiff(div, 'value');
  });

  describe('opened', () => {
    function openOverlay() {
      element.opened = true;
      div.style.height = `${element.offsetHeight + element.$.overlay.$.overlay.offsetHeight}px`;
      div.style.width = `${element.$.overlay.$.overlay.offsetWidth}px`;
    }

    it('default', async () => {
      element.value = '2000-01-01';
      openOverlay();
      await visualDiff(div, 'opened');
    });

    it('week numbers', async () => {
      element.value = '2000-01-01';
      element.showWeekNumbers = true;
      element.i18n = { firstDayOfWeek: 1 };
      openOverlay();
      await visualDiff(div, 'week-numbers');
    });

    it('fullscreen', async () => {
      element.value = '2000-01-01';
      element._fullscreen = true;
      await openOverlay();
      await visualDiff(element._overlayContent, 'fullscreen');
    });
  });
});
