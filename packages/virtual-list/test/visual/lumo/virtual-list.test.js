import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '../../../vaadin-virtual-list.js';

describe('virtual-list', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync(
      `
        <vaadin-virtual-list style="height: 200px"></vaadin-virtual-list>
      `,
      div,
    );
    element.items = Array.from({ length: 100000 }).map((_, i) => {
      return { label: `Item ${i}` };
    });
    element.renderer = (root, _, { item }) => {
      root.innerHTML = `<div>${item.label}</div>`;
    };
    await nextRender();
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });
});
