import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/virtual-list';
import '@vaadin/card';

describe('virtual-list with card items', () => {
  let virtualList;

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
    virtualList.scrollTop = virtualList.scrollHeight;

    await aTimeout(200); // Wait for the scroll to settle

    // Ensure that the first two visible items do not overlap
    const firstVisibleItem = virtualList.querySelector(`#card-${virtualList.firstVisibleIndex}`);
    const secondVisibleItem = virtualList.querySelector(`#card-${virtualList.firstVisibleIndex + 1}`);
    expect(firstVisibleItem.getBoundingClientRect().bottom).to.be.at.most(
      secondVisibleItem.getBoundingClientRect().top,
    );
  });
});
