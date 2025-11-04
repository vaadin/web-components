import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-virtual-list.js';

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

  it('theme-overflow-indicators-bottom', async () => {
    element.setAttribute('theme', 'overflow-indicator-bottom');
    await visualDiff(div, 'theme-overflow-indicators-bottom');
  });

  it('theme-overflow-indicators-both', async () => {
    element.setAttribute('theme', 'overflow-indicators');
    element.scrollTop = 100;
    await visualDiff(div, 'theme-overflow-indicators-both');
  });

  it('theme-overflow-indicators-top', async () => {
    element.setAttribute('theme', 'overflow-indicator-top');
    element.scrollTop = element.scrollHeight - element.clientHeight;
    await visualDiff(div, 'theme-overflow-indicators-top');
  });
});
