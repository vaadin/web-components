import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon/vaadin-icon.js';
import '../../vaadin-iconset.js';

describe('vaadin-iconset', () => {
  let wrapper;

  before(async () => {
    const { origin, pathname } = new URL(import.meta.url);
    const file = pathname.replace(/visual\/.+/u, 'glyphs.json');
    const data = await fetch(`${origin}${file}`);
    const icons = await data.json();
    wrapper = fixtureSync(`
      <div style="display: flex; flex-wrap: wrap; width: 600px">
        ${icons.map((icon) => `<vaadin-icon icon="lumo:${icon}"></vaadin-icon>`).join('\n')}
      </div>
    `);
    await nextFrame();
  });

  it('basic', async () => {
    await visualDiff(wrapper, 'vaadin-iconset');
  });
});
