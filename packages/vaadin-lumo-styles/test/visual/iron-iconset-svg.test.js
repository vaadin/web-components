import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../icons.js';

describe('iron-iconset-svg', () => {
  let wrapper;

  before(async () => {
    const { origin, pathname } = new URL(import.meta.url);
    const file = pathname.replace(/visual\/.+/, 'glyphs.json');
    const data = await fetch(`${origin}${file}`);
    const icons = await data.json();
    wrapper = fixtureSync(`
      <div style="display: flex; flex-wrap: wrap; width: 600px">
        ${icons.map((icon) => `<iron-icon icon="lumo:${icon}"></iron-icon>`).join('\n')}
      </div>
    `);
    await nextFrame();
  });

  it('basic', async () => {
    await visualDiff(wrapper, 'iron-iconset-svg');
  });
});
