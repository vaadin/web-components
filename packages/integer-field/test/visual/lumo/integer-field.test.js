import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/integer-field.css';
import '../../../vaadin-integer-field.js';

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

  it('clear button', async () => {
    element.value = 10;
    element.clearButtonVisible = true;
    await visualDiff(div, 'clear-button');
  });

  it('step buttons visible', async () => {
    element.stepButtonsVisible = true;
    element.value = 5;
    await visualDiff(div, 'step-buttons-visible');
  });
});
