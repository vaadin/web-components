import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-progress-bar.js';

describe('vaadin-progress-bar', () => {
  let progress;

  beforeEach(async () => {
    progress = fixtureSync('<vaadin-progress-bar></vaadin-progress-bar>');
    await nextRender();
  });

  it('host', async () => {
    await expect(progress).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(progress).shadowDom.to.equalSnapshot();
  });
});
