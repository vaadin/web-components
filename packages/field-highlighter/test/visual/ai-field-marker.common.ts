import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import './ai-field-marker-not-animated-styles.css';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '../../src/vaadin-ai-field-marker.js';
import type { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';
import type { AiFieldMarker } from '../../src/vaadin-ai-field-marker.js';

describe('ai-field-marker', () => {
  let div: HTMLDivElement;
  let field: TextField;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
  });

  function mark(properties: Partial<AiFieldMarker> = {}): AiFieldMarker {
    const marker = document.createElement('vaadin-ai-field-marker');
    Object.assign(marker, properties);
    field.appendChild(marker);
    return marker;
  }

  async function createField({ overlay = false }: { overlay?: boolean } = {}) {
    div = document.createElement('div');
    div.style.padding = '20px';
    if (overlay) {
      // Leave room for the badge tooltip / popover overlay next to the field.
      div.style.width = '640px';
      div.style.height = '220px';
    } else {
      div.style.width = 'fit-content';
    }
    field = fixtureSync(
      '<vaadin-text-field label="Name" value="AI value" style="width: 220px;"></vaadin-text-field>',
      div,
    );
    await nextRender();
  }

  describe('marked', () => {
    ['ltr', 'rtl'].forEach((dir) => {
      describe(dir, () => {
        before(() => {
          document.documentElement.setAttribute('dir', dir);
        });

        after(() => {
          document.documentElement.removeAttribute('dir');
        });

        it('basic', async () => {
          await createField();
          mark();
          await nextRender();
          await visualDiff(div, `ai-marker-${dir}-basic`);
        });
      });
    });

    it('badge focus', async () => {
      await createField({ overlay: true });
      mark();
      await nextRender();
      // Tab to the field input and on to the badge: keyboard focus shows the
      // focus ring and opens the badge tooltip.
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await nextRender();
      await visualDiff(div, 'ai-marker-badge-focus');
    });
  });

  describe('popover', () => {
    beforeEach(async () => {
      await createField({ overlay: true });
    });

    it('default content', async () => {
      mark();
      await nextRender();
      field.querySelector<HTMLButtonElement>('.badge')!.click();
      await nextRender();
      await visualDiff(div, 'ai-marker-popover');
    });
  });

  describe('working', () => {
    beforeEach(async () => {
      await createField();
    });

    it('working', async () => {
      mark({ working: true });
      await nextRender();
      await visualDiff(div, 'ai-marker-working');
    });

    it('working while marked', async () => {
      // The badge and glow describe the value the AI is about to replace, so
      // the working state hides them along with showing the shimmer.
      const marker = mark();
      await nextRender();
      marker.working = true;
      await nextRender();
      await visualDiff(div, 'ai-marker-working-marked');
    });
  });
});
