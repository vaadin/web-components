import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/form-layout/vaadin-form-layout.js';
import '@vaadin/text-field/vaadin-text-field.js';
import '../../not-animated-styles.css';
import '../../../src/vaadin-crud.js';

describe('focus-ring', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-crud>
        <vaadin-form-layout slot="form">
          <vaadin-text-field path="name.first"></vaadin-text-field>
          <vaadin-text-field path="name.last"></vaadin-text-field>
        </vaadin-form-layout>
      </vaadin-crud>
    `);
    element.items = [{ name: { first: 'John', last: 'Doe' } }];
    await nextRender();
  });

  it('editor-first-field', async () => {
    element.editedItem = element.items[0];
    await nextRender();
    await sendKeys({ press: 'Tab' });
    element.querySelector('vaadin-text-field').focus();
    const overlay = element.$.dialog.shadowRoot.querySelector('vaadin-crud-dialog-overlay');
    await visualDiff(overlay.shadowRoot.querySelector('[part="overlay"]'), 'editor-first-field');
  });
});
