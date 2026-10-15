import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/virtual-list';
import '@vaadin/card';

describe('virtual-list with card items', () => {
  let virtualList;

  async function contentUpdate() {
    // Wait for the content to update (and resize observer to fire)
    await aTimeout(200);
  }

  beforeEach(async () => {
    virtualList = fixtureSync(`
      <vaadin-virtual-list style="height: 300px;"></vaadin-virtual-list>
    `);

    // Create a renderer that creates a new vaadin-card on each render
    // See https://github.com/vaadin/web-components/issues/9077
    virtualList.renderer = (root, _, model) => {
      root.innerHTML = `
          <vaadin-card id="card-${model.index}">
            <div slot="title">Title ${model.index}</div>
            <div slot="subtitle">Subtitle ${model.index}</div>
          </vaadin-card>
        `;
    };

    virtualList.items = Array.from({ length: 100 }, (_, i) => ({ index: i }));
    await nextFrame();
  });

  it('should not overlap items after scrolling', async () => {
    // Scroll manually to the end
    while (Math.ceil(virtualList.scrollTop) < virtualList.scrollHeight - virtualList.clientHeight) {
      virtualList.scrollTop += 100;
      await oneEvent(virtualList, 'scroll');
    }

    await contentUpdate();

    // Ensure that the first two visible items do not overlap
    const firstVisibleItem = virtualList.querySelector(`#card-${virtualList.firstVisibleIndex}`);
    const secondVisibleItem = virtualList.querySelector(`#card-${virtualList.firstVisibleIndex + 1}`);
    expect(firstVisibleItem.getBoundingClientRect().bottom).to.be.at.most(
      secondVisibleItem.getBoundingClientRect().top,
    );
  });

  it('should not overlap items after changing scroll position', async () => {
    virtualList.scrollTop = virtualList.scrollHeight;

    await contentUpdate();

    // Ensure that the first two visible items do not overlap
    const firstVisibleItem = virtualList.querySelector(`#card-${virtualList.firstVisibleIndex}`);
    const secondVisibleItem = virtualList.querySelector(`#card-${virtualList.firstVisibleIndex + 1}`);
    expect(firstVisibleItem.getBoundingClientRect().bottom).to.be.at.most(
      secondVisibleItem.getBoundingClientRect().top,
    );
  });
});
