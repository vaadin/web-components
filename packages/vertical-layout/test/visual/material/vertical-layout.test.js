import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-vertical-layout.js';

describe('vertical-layout', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'flex';
    element = fixtureSync(
      `
        <vaadin-vertical-layout style="border: solid 2px blue">
          <div style="background: #e2e2e2; padding: 20px;">Item 1</div>
          <div style="background: #f3f3f3; padding: 20px;">Item 2</div>
        </vaadin-vertical-layout>
      `,
      div
    );
  });

  it('basic', async () => {
    await visualDiff(div, `${import.meta.url}_basic`);
  });

  it('theme-margin', async () => {
    element.setAttribute('theme', 'margin');
    await visualDiff(div, `${import.meta.url}_theme-margin`);
  });

  it('theme-padding', async () => {
    element.setAttribute('theme', 'padding');
    await visualDiff(div, `${import.meta.url}_theme-padding`);
  });

  it('theme-spacing', async () => {
    element.setAttribute('theme', 'spacing');
    await visualDiff(div, `${import.meta.url}_theme-spacing`);
  });

  it('theme-margin-padding', async () => {
    element.setAttribute('theme', 'margin padding');
    await visualDiff(div, `${import.meta.url}_theme-margin-padding`);
  });

  it('theme-margin-spacing', async () => {
    element.setAttribute('theme', 'margin spacing');
    await visualDiff(div, `${import.meta.url}_theme-margin-spacing`);
  });

  it('theme-margin-padding-spacing', async () => {
    element.setAttribute('theme', 'margin padding spacing');
    await visualDiff(div, `${import.meta.url}_theme-margin-padding-spacing`);
  });
});
