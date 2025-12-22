import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../src/vaadin-accordion.js';

describe('accordion', () => {
  let div, element, panels;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';

    element = fixtureSync(
      `
        <vaadin-accordion>
          <vaadin-accordion-panel>
            <vaadin-accordion-heading slot="summary">Panel 1</vaadin-accordion-heading>
            <div>Content 1</div>
          </vaadin-accordion-panel>
          <vaadin-accordion-panel>
            <vaadin-accordion-heading slot="summary">Panel 2</vaadin-accordion-heading>
            <div>Content 2</div>
          </vaadin-accordion-panel>
          <vaadin-accordion-panel>
            <vaadin-accordion-heading slot="summary">Panel 3</vaadin-accordion-heading>
            <div>Content 3</div>
          </vaadin-accordion-panel>
        </vaadin-accordion>
      `,
      div,
    );
    panels = [...element.querySelectorAll('vaadin-accordion-panel')];
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('filled', async () => {
    panels.forEach((panel) => {
      panel.setAttribute('theme', 'filled');
    });
    await visualDiff(div, 'filled');
  });
});
