import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-list-box.js';

describe('vaadin-list-box', () => {
  let listBox;

  beforeEach(() => {
    listBox = fixtureSync('<vaadin-list-box></vaadin-list-box>');
  });

  it('default', async () => {
    await expect(listBox).shadowDom.to.equalSnapshot();
  });
});
