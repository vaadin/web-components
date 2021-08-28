import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-split-layout.js';

describe('vaadin-split-layout', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-split-layout>
        <div>Block one</div>
        <div>Block two</div>
      </vaadin-split-layout>
    `);
    await nextFrame();
  });

  it('default', async () => {
    await expect(layout).shadowDom.to.equalSnapshot();
  });

  it('slots', async () => {
    await expect(layout).lightDom.to.equalSnapshot();
  });
});
