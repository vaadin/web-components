import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../enable.js';
import '../../../theme/material/vaadin-side-nav.js';

describe('side-nav', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-side-nav></vaadin-side-nav>', div);
  });

  // A placeholder test to be removed once Material theme support is added.
  it('basic', async () => {
    await visualDiff(div, 'basic');
  });
});
