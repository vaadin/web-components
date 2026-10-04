import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';

describe('context menu layout', () => {
  it('should preserve inline layout around a wrapped target', async () => {
    const container = fixtureSync(`
      <div style="white-space: nowrap">
        <span>Before</span><vaadin-context-menu><span>Target</span></vaadin-context-menu><span>After</span>
      </div>
    `);
    await nextRender();
    const [before, target, after] = container.querySelectorAll('span');
    expect(target.getBoundingClientRect().top).to.equal(before.getBoundingClientRect().top);
    expect(after.getBoundingClientRect().top).to.equal(before.getBoundingClientRect().top);
  });

  it('should allow wrapped targets to participate in flex layout', async () => {
    const container = fixtureSync(`
      <div style="display: flex; width: 300px; gap: 12px">
        <span style="flex: 1">Before</span>
        <vaadin-context-menu>
          <span style="flex: 1">First</span>
          <span style="flex: 1">Second</span>
        </vaadin-context-menu>
      </div>
    `);
    await nextRender();
    for (const span of container.querySelectorAll('span')) {
      expect(span.getBoundingClientRect().width).to.equal(92);
    }
  });

  it('should allow wrapped targets to participate in grid layout', async () => {
    const container = fixtureSync(`
      <div style="display: grid; grid-template-columns: repeat(3, 100px); gap: 12px">
        <span>Before</span>
        <vaadin-context-menu><span>First</span><span>Second</span></vaadin-context-menu>
      </div>
    `);
    await nextRender();
    const [before, first, second] = container.querySelectorAll('span');
    expect(first.getBoundingClientRect().left - before.getBoundingClientRect().left).to.equal(112);
    expect(second.getBoundingClientRect().left - first.getBoundingClientRect().left).to.equal(112);
  });

  it('should hide wrapped content when hidden', async () => {
    const menu = fixtureSync('<vaadin-context-menu hidden><button>Target</button></vaadin-context-menu>');
    await nextRender();
    expect(menu.querySelector('button').getClientRects()).to.have.lengthOf(0);
  });
});
