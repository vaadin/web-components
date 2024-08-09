import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-form-item.js';

describe('vaadin-form-item', () => {
  let field;

  beforeEach(() => {
    field = fixtureSync(`
      <vaadin-form-item>
        <label slot="label">First name</label>
        <input>
      </vaadin-form-item>
    `);
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(field).shadowDom.to.equalSnapshot();
    });
  });
});
