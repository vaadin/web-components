import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../vaadin-accordion-panel.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-accordion-panel', () => {
  let panel;

  beforeEach(() => {
    resetUniqueId();
    panel = fixtureSync(`
      <vaadin-accordion-panel>
        <vaadin-accordion-heading slot="summary">Summary</vaadin-accordion-heading>
        <div>Content</div>
      </vaadin-accordion-panel>
    `);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(panel).dom.to.equalSnapshot();
    });

    it('opened', async () => {
      panel.opened = true;
      await expect(panel).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      panel.disabled = true;
      await expect(panel).dom.to.equalSnapshot();
    });

    it('theme', async () => {
      panel.setAttribute('theme', 'filled');
      await expect(panel).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(panel).shadowDom.to.equalSnapshot();
    });

    it('opened', async () => {
      panel.opened = true;
      await expect(panel).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      panel.disabled = true;
      await expect(panel).shadowDom.to.equalSnapshot();
    });
  });
});
