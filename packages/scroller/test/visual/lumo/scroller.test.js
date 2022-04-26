import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-scroller.js';

describe('scroller', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';

    element = fixtureSync(
      `
      <vaadin-scroller style="width: 200px; height: 200px;">
        <div id="content" style="width: 400px;"></div>
      </vaadin-scroller>`,
      div,
    );
    element.firstElementChild.textContent = new Array(1000).fill('content').join(' ');
  });

  it('default', async () => {
    await visualDiff(div, 'default');
  });

  it('focus-ring', async () => {
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'focus-ring');
  });
});
