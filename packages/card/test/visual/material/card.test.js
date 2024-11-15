import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-card.js';

describe('card', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-card><div style="padding: 10px;">Card</div></vaadin-card>', div);
  });

  describe('theme', () => {
    it('default', async () => {
      await visualDiff(div, 'theme-default');
    });

    it('outlined', async () => {
      element.setAttribute('theme', 'outlined');
      await visualDiff(div, 'theme-outlined');
    });

    it('elevated', async () => {
      element.setAttribute('theme', 'elevated');
      await visualDiff(div, 'theme-elevated');
    });

    it('outlined elevated', async () => {
      element.setAttribute('theme', 'outlined elevated');
      await visualDiff(div, 'theme-outlined-elevated');
    });
  });
});
