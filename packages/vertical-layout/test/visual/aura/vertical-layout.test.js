import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-vertical-layout.js';

describe('vertical-layout', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'flex';
    div.style.padding = '2px';
    element = fixtureSync(
      `
        <vaadin-vertical-layout style="border: solid 1px var(--vaadin-border-color)">
          <div class="aura-surface" style="padding: 20px; --aura-surface-level: -1">
            Item
          </div>
          <div class="aura-surface-solid" style="padding: 20px; --aura-surface-level: -1">
            Item
          </div>
        </vaadin-vertical-layout>
      `,
      div,
    );
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('theme-margin', async () => {
    element.setAttribute('theme', 'margin');
    await visualDiff(div, 'theme-margin');
  });

  it('theme-padding', async () => {
    element.setAttribute('theme', 'padding');
    await visualDiff(div, 'theme-padding');
  });

  it('theme-spacing', async () => {
    element.setAttribute('theme', 'spacing');
    await visualDiff(div, 'theme-spacing');
  });

  it('theme-margin-padding', async () => {
    element.setAttribute('theme', 'margin padding');
    await visualDiff(div, 'theme-margin-padding');
  });

  it('theme-margin-spacing', async () => {
    element.setAttribute('theme', 'margin spacing');
    await visualDiff(div, 'theme-margin-spacing');
  });

  it('theme-margin-padding-spacing', async () => {
    element.setAttribute('theme', 'margin padding spacing');
    await visualDiff(div, 'theme-margin-padding-spacing');
  });
});
