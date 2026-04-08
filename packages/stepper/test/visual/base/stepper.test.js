import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-stepper.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.stepperComponent = true;

describe('stepper', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    fixtureSync('<vaadin-stepper>Label</vaadin-stepper>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });
});
