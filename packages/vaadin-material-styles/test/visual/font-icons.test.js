import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../font-icons.js';

describe('font-icons', () => {
  let wrapper;

  before(async () => {
    const { origin, pathname } = new URL(import.meta.url);
    const file = pathname.replace(/visual\/.+/u, 'glyphs.json');
    const data = await fetch(`${origin}${file}`);
    const icons = await data.json();
    wrapper = fixtureSync(`
      <div style="display: flex; flex-wrap: wrap; width: 600px">
        <style>
          .font-icon {
            font-family: material-icons;
            font-size: 24px;
          }

          ${icons
            .map((icon) => {
              return `
              .font-icon.${icon}::before {
                display: block;
                content: var(--material-icons-${icon});
              }
            `;
            })
            .join('\n')}
        </style>
        ${icons.map((icon) => `<span class="font-icon ${icon}"></span>`).join('\n')}
      </div>
    `);
    await nextFrame();
  });

  it('basic', async () => {
    await visualDiff(wrapper, 'font-icons');
  });
});
