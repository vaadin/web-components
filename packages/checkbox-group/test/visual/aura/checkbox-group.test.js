import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
import '../../../vaadin-checkbox-group.js';

describe('checkbox-group', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';

    element = fixtureSync(
      `
        <vaadin-checkbox-group>
          <vaadin-checkbox value="a" label="A"></vaadin-checkbox>
          <vaadin-checkbox value="b" label="B"></vaadin-checkbox>
          <vaadin-checkbox value="c" label="C"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `,
      div,
    );
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('value', async () => {
    element.value = ['a', 'c'];
    await visualDiff(div, 'value');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('disabled value', async () => {
    element.disabled = true;
    element.value = ['a', 'c'];
    await visualDiff(div, 'disabled-value');
  });

  it('disabled label', async () => {
    element.label = 'Label';
    element.disabled = true;
    await visualDiff(div, 'disabled-label');
  });

  it('readonly', async () => {
    element.readonly = true;
    element.value = ['a', 'c'];
    await visualDiff(div, 'readonly');
  });
});
