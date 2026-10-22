import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-infinite-scroller.js';

describe('vaadin-infinite-scroller', () => {
  let scroller;

  beforeEach(async () => {
    scroller = fixtureSync(`
      <vaadin-infinite-scroller>
        <template>
          <div>[[index]]</div>
        </template>
      </vaadin-infinite-scroller>
    `);
    await nextFrame();
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(scroller).shadowDom.to.equalSnapshot();
    });
  });
});
