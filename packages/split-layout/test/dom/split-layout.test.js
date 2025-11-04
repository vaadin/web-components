import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-split-layout.js';

describe('vaadin-split-layout', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync('<vaadin-split-layout></vaadin-split-layout>');
    await nextRender();
  });

  it('host', async () => {
    await expect(layout).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(layout).shadowDom.to.equalSnapshot();
  });
});
