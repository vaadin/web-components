import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-scroller.js';

describe('scroller', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';

    element = fixtureSync(
      `
      <vaadin-scroller style="width: 400px; height: 200px;">
        <div id="content"></div>
      </vaadin-scroller>`,
      div,
    );
    element.firstElementChild.textContent = new Array(1000).fill('content').join(' ');
  });

  it('default', async () => {
    await visualDiff(div, 'default');
  });

  it('theme-overflow-indicator-bottom', async () => {
    element.setAttribute('theme', 'overflow-indicator-bottom');
    await visualDiff(div, 'theme-overflow-indicator-bottom');
  });

  it('theme-overflow-indicators', async () => {
    element.setAttribute('theme', 'overflow-indicators');
    element.scrollTop = 36;
    await visualDiff(div, 'theme-overflow-indicators');
  });

  it('theme-overflow-indicator-top', async () => {
    element.setAttribute('theme', 'overflow-indicator-top');
    element.scrollTop = element.scrollHeight - element.clientHeight;
    await visualDiff(div, 'theme-overflow-indicator-top');
  });
});
