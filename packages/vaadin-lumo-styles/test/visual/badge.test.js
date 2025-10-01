import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../src/props/index.css';
import '../../global.css';

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
