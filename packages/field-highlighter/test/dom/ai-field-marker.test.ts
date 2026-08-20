import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '../../src/vaadin-ai-field-marker.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import type { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';
import type { AiFieldMarker } from '../../src/vaadin-ai-field-marker.js';

describe('vaadin-ai-field-marker', () => {
  let field: TextField;
  let marker: AiFieldMarker;

  beforeEach(async () => {
    resetUniqueId();
    field = fixtureSync('<vaadin-text-field label="Name" value="AI value"></vaadin-text-field>');
    await nextRender();
    marker = document.createElement('vaadin-ai-field-marker');
    field.appendChild(marker);
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(marker).dom.to.equalSnapshot();
    });

    it('content', async () => {
      const content = document.createElement('div');
      content.textContent = 'Based on invoice.pdf';
      marker.content = content;
      await nextRender();
      await expect(marker).dom.to.equalSnapshot();
    });

    it('unmarked', async () => {
      // Moved to a parent that is not a field, so there is nothing to annotate.
      fixtureSync('<div id="container"></div>').appendChild(marker);
      await nextRender();
      await expect(marker).dom.to.equalSnapshot();
    });

    it('confidence', async () => {
      marker.confidence = 'high';
      await nextRender();
      // The indicator is a sibling of the marker slotted into the field's
      // helper text section.
      await expect(field.querySelector(':scope > [slot="helper"]')!).dom.to.equalSnapshot();
    });
  });
});
