import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-accordion.js';

describe('accordion', () => {
  let div, element;

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
  });

  it('opened-start', async () => {
    await visualDiff(div, 'opened-start');
  });

  it('opened-middle', async () => {
    element.opened = 1;
    await visualDiff(div, 'opened-middle');
  });

  it('opened-end', async () => {
    element.opened = 2;
    await visualDiff(div, 'opened-end');
  });

  it('closed', async () => {
    element.opened = null;
    await visualDiff(div, 'closed');
  });
});
