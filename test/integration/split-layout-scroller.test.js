import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/scroller';
import '@vaadin/split-layout';

describe('scroller in split-layout', () => {
  let splitLayout, scroller;

  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout style="width: 400px; height: 200px">
        <vaadin-scroller>
          <div style="height: 1000px"></div>
        </vaadin-scroller>
        <div></div>
      </vaadin-split-layout>
    `);
    scroller = splitLayout.querySelector('vaadin-scroller');
    await nextFrame();
  });

  it('should scroll the scroller content', async () => {
    scroller.scrollTop = 100;
    await nextFrame();
    expect(scroller.scrollTop).to.equal(100);
  });
});
