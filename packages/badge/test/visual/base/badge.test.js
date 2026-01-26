import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-badge.js';

describe('badge', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-badge></vaadin-badge>', div);
  });

  it('basic', async () => {
    element.textContent = 'Badge';
    await visualDiff(div, 'basic');
  });

  it('empty', async () => {
    await visualDiff(div, 'empty');
  });

  it('long-text', async () => {
    element.textContent = 'Very Long Badge Text';
    await visualDiff(div, 'long-text');
  });

  it('number', async () => {
    element.textContent = '42';
    await visualDiff(div, 'number');
  });
});
