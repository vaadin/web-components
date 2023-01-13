import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../vaadin-iconset.js';

describe('vaadin-iconset', () => {
  let wrapper;

  before(async () => {
    const { origin, pathname } = new URL(import.meta.url);
    const file = pathname.replace(/test\/.+/u, 'assets/vaadin-font-icons.json');
    const data = await fetch(`${origin}${file}`);
    const icons = await data.json();
    wrapper = fixtureSync(`
      <div style="display: flex; flex-wrap: wrap;">
        ${icons.map(({ name }) => `<vaadin-icon icon="vaadin:${name}" style="margin: 3px"></vaadin-icon>`).join('\n')}
      </div>
    `);
    await nextFrame();
  });

  it('basic', async () => {
    await visualDiff(wrapper, 'vaadin-iconset');
  });
});
