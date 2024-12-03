import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-accordion-panel', () => {
  let panel;

  beforeEach(async () => {
    resetUniqueId();
    panel = fixtureSync(`
      <vaadin-accordion-panel>
        <vaadin-accordion-heading slot="summary">Summary</vaadin-accordion-heading>
        <div>Content</div>
      </vaadin-accordion-panel>
    `);
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(panel).dom.to.equalSnapshot();
    });

    it('opened', async () => {
      panel.opened = true;
      await nextUpdate(panel);
      await expect(panel).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      panel.disabled = true;
      await nextUpdate(panel);
      await expect(panel).dom.to.equalSnapshot();
    });

    it('theme', async () => {
      panel.setAttribute('theme', 'filled');
      await nextUpdate(panel);
      await expect(panel).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(panel).shadowDom.to.equalSnapshot();
    });
  });
});
