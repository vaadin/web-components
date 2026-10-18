import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/item/src/vaadin-item.js';
import '../../src/vaadin-list-box.js';

describe('vaadin-list-box', () => {
  let listBox;

  beforeEach(async () => {
    listBox = fixtureSync(`
      <vaadin-list-box aria-label="Size">
        <vaadin-item>Small</vaadin-item>
        <vaadin-item>Medium</vaadin-item>
        <vaadin-item disabled>Large</vaadin-item>
      </vaadin-list-box>
    `);
    await nextRender();
  });

  it('single', async () => {
    listBox.selected = 1;
    await nextRender();
    await expect(listBox).to.equalA11yTreeSnapshot();
    await expect(listBox).to.be.accessible();
  });

  it('multiple', async () => {
    listBox.multiple = true;
    listBox.selectedValues = [0, 1];
    await nextRender();
    await expect(listBox).to.equalA11yTreeSnapshot();
    await expect(listBox).to.be.accessible();
  });
});
