import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
import '../../../vaadin-custom-field.js';

describe('custom-field', () => {
  describe('basic', () => {
    let div, element;

    beforeEach(() => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';

      element = fixtureSync(
        `
        <vaadin-custom-field>
          <input type="text" />
          <input type="number" />
        </vaadin-custom-field>
      `,
        div,
      );
    });

    it('basic', async () => {
      await visualDiff(div, 'default');
    });

    it('label', async () => {
      element.label = 'Home address';
      await visualDiff(div, 'label');
    });
  });
});
