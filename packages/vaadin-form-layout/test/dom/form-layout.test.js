import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-form-layout.js';

describe('vaadin-form-layout', () => {
  let layout;

  beforeEach(() => {
    layout = fixtureSync('<vaadin-form-layout></vaadin-form-layout>');
  });

  it('default', async () => {
    await expect(layout).shadowDom.to.equalSnapshot();
  });
});
