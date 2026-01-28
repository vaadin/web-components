import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
import '../../../vaadin-radio-group.js';

describe('radio-group', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';

    element = fixtureSync(
      `
        <vaadin-radio-group>
          <vaadin-radio-button value="a" label="A"></vaadin-radio-button>
          <vaadin-radio-button value="b" label="B"></vaadin-radio-button>
          <vaadin-radio-button value="c" label="C"></vaadin-radio-button>
        </vaadin-radio-group>
      `,
      div,
    );
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('value', async () => {
    element.value = 'a';
    await visualDiff(div, 'value');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('disabled value', async () => {
    element.disabled = true;
    element.value = 'a';
    await visualDiff(div, 'disabled-value');
  });

  it('disabled label', async () => {
    element.label = 'Label';
    element.disabled = true;
    await visualDiff(div, 'disabled-label');
  });

  it('readonly', async () => {
    element.readonly = true;
    element.value = 'a';
    await visualDiff(div, 'readonly');
  });
});
