import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-form-layout.js';
import '../../../vaadin-form-item.js';

describe('form-layout', () => {
  let element;

  describe('basic', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-form-layout>
          <vaadin-form-item>
            <label slot="label">First Name</label>
            <input class="full-width" value="Jane" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Last Name</label>
            <input class="full-width" value="Doe" />
          </vaadin-form-item>

          <vaadin-form-item>
            <label slot="label">Email</label>
            <input class="full-width" value="jane.doe@example.com" />
          </vaadin-form-item>

          <vaadin-form-item>
            <span slot="label">Date of Birth</span>
            <input placeholder="YYYY" size="4" /> - <input placeholder="MM" size="2" /> -
            <input placeholder="DD" size="2" /><br />
            <em>Example: 1900-01-01</em>
          </vaadin-form-item>

          <vaadin-form-item colspan="2">
            <label slot="label">Conference Abstract</label>
            <textarea rows="6" class="full-width" style="display: inline-flex; vertical-align: top"></textarea>
          </vaadin-form-item>

          <vaadin-form-item>
            <input type="checkbox" />
            Subscribe to our Newsletter
          </vaadin-form-item>
        </vaadin-form-layout>
      `);
    });

    it('basic', async () => {
      await visualDiff(element, 'basic');
    });
  });
});
