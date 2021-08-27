import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-progress-bar.js';

describe('vaadin-progress-bar', () => {
  let progress;

  beforeEach(() => {
    progress = fixtureSync('<vaadin-progress-bar></vaadin-progress-bar>');
  });

  it('default', async () => {
    await expect(progress).shadowDom.to.equalSnapshot();
  });
});
