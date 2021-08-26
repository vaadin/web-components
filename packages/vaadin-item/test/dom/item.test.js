import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-item.js';

describe('vaadin-item', () => {
  let item;

  beforeEach(() => {
    item = fixtureSync('<vaadin-item>Content</vaadin-item>');
  });

  it('default', async () => {
    await expect(item).shadowDom.to.equalSnapshot();
  });
});
