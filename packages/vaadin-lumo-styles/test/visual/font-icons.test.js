import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../props.css';
import '../../global.css';

describe('font-icons', () => {
  let wrapper;

  before(async () => {
    const { origin, pathname } = new URL(import.meta.url);
    const file = pathname.replace(/visual\/.+/u, 'glyphs.json');
    const data = await fetch(`${origin}${file}`);
    const icons = await data.json();
    wrapper = fixtureSync(`
      <div style="display: flex; flex-wrap: wrap; width: 600px; line-height: 1">
        <style>
          .font-icon {
            font-family: lumo-icons;
            font-size: 24px;
          }

          ${icons
            .map((icon) => {
              return `
              .font-icon.${icon}::before {
                display: block;
                content: var(--lumo-icons-${icon});
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
