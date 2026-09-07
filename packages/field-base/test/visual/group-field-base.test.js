import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../fixtures/mock-group-field.js';

describe('group-field-base', () => {
  let div, element;

  beforeEach(() => {
    div = fixtureSync(`
      <div style="width: fit-content; padding: 10px">
        Baseline
        <mock-group-field>
          <span>Item A</span>
          <span>Item B</span>
          <span>Item C</span>
        </mock-group-field>
      </div>
    `);
    element = div.querySelector('mock-group-field');
  });

  it('default', async () => {
    await visualDiff(div, 'group-default');
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, 'group-label');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'group-required');
  });

  it('error message', async () => {
    element.errorMessage = 'This field is required';
    element.invalid = true;
    await visualDiff(div, 'group-error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'group-helper-text');
  });

  it('helper above field', async () => {
    element.helperText = 'Helper text';
    element.setAttribute('theme', 'helper-above-field');
    await visualDiff(div, 'group-helper-above-field');
  });

  it('label and helper above field', async () => {
    element.label = 'Label';
    element.helperText = 'Helper text';
    element.setAttribute('theme', 'helper-above-field');
    await visualDiff(div, 'group-label-helper-above-field');
  });

  describe('horizontal', () => {
    beforeEach(() => {
      element.setAttribute('theme', 'horizontal');
    });

    it('default', async () => {
      await visualDiff(div, 'group-horizontal');
    });

    it('label', async () => {
      element.label = 'Label';
      await visualDiff(div, 'group-horizontal-label');
    });

    it('wrapped', async () => {
      element.style.width = '150px';
      await visualDiff(div, 'group-horizontal-wrapped');
    });

    it('helper above field', async () => {
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'horizontal helper-above-field');
      await visualDiff(div, 'group-horizontal-helper-above-field');
    });

    it('label and helper above field', async () => {
      element.label = 'Label';
      element.helperText = 'Helper text';
      element.setAttribute('theme', 'horizontal helper-above-field');
      await visualDiff(div, 'group-horizontal-label-helper-above-field');
    });
  });
});
