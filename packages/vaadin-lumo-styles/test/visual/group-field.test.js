import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../src/props/index.css';
import '../../src/global/index.css';
import '../fixtures/mock-group-field.js';

describe('group-field', () => {
  let div, element;

  beforeEach(() => {
    div = fixtureSync(`
      <div style="width: fit-content; padding: 10px">
        Baseline
        <mock-group-field>
          <span style="padding: 0.25em; line-height: var(--lumo-line-height-s)">Item A</span>
          <span style="padding: 0.25em; line-height: var(--lumo-line-height-s)">Item B</span>
          <span style="padding: 0.25em; line-height: var(--lumo-line-height-s)">Item C</span>
        </mock-group-field>
      </div>
    `);
    element = div.querySelector('mock-group-field');
  });

  it('default', async () => {
    await visualDiff(div, 'group-field-default');
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, 'group-field-label');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'group-field-required');
  });

  it('error message', async () => {
    element.errorMessage = 'This field is required';
    element.invalid = true;
    await visualDiff(div, 'group-field-error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'group-field-helper-text');
  });

  it('helper above field', async () => {
    element.label = 'Label';
    element.helperText = 'Helper text';
    element.setAttribute('theme', 'helper-above-field');
    await visualDiff(div, 'group-field-helper-above-field');
  });

  describe('vertical', () => {
    beforeEach(() => {
      element.setAttribute('theme', 'vertical');
    });

    it('default', async () => {
      await visualDiff(div, 'group-field-vertical');
    });

    it('label', async () => {
      element.label = 'Label';
      await visualDiff(div, 'group-field-vertical-label');
    });

    it('wrapped', async () => {
      element.style.width = '150px';
      await visualDiff(div, 'group-field-vertical-wrapped');
    });

    it('helper above field', async () => {
      element.label = 'Label';
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'vertical helper-above-field');
      await visualDiff(div, 'group-field-vertical-helper-above-field');
    });
  });
});
