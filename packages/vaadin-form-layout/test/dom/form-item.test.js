import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-form-item.js';

describe('vaadin-form-item', () => {
  let item;

  beforeEach(() => {
    item = fixtureSync('<vaadin-form-item></vaadin-form-item>');
  });

  it('default', async () => {
    await expect(item).shadowDom.to.equalSnapshot();
  });
});
