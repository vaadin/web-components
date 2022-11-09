import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-integer-field.js';

describe('integer-field', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-integer-field></vaadin-integer-field>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('value', async () => {
    element.value = 10;
    await visualDiff(div, 'value');
  });

  it('controls', async () => {
    element.hasControls = true;
    await visualDiff(div, 'controls');
  });

  it('step buttons visible', async () => {
    element.stepButtonsVisible = true;
    await visualDiff(div, 'step-buttons-visible');
  });
});
