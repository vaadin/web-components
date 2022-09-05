import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-progress-bar.js';

describe('vaadin-progress-bar', () => {
  let progressBar;

  beforeEach(() => {
    progressBar = fixtureSync('<vaadin-progress-bar></vaadin-progress-bar>');
  });

  it('default', async () => {
    await expect(progressBar).shadowDom.to.equalSnapshot();
  });
});
