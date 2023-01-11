import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import { badge } from '../../badge.js';

const badgeStyle = document.createElement('style');
badgeStyle.textContent = badge.cssText;
document.head.appendChild(badgeStyle);

describe('badge', () => {
  it('flex-shrink', async () => {
    const wrapper = fixtureSync(`
      <div style="display: flex; align-items: baseline; gap: 20px; width: 400px">
        <span theme="badge">This is a badge</span>

        <span style="flex-basis: 100%; background-color: #eee;">Sibling</span>
      </div>
    `);
    await visualDiff(wrapper, 'flex-shrink');
  });
});
