import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-progress-bar.js';

describe('progress-bar', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.width = '200px';
    element = fixtureSync('<vaadin-progress-bar value="0.1"></vaadin-progress-bar>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('RTL', async () => {
    element.setAttribute('dir', 'rtl');
    await visualDiff(div, 'rtl-basic');
  });
});
