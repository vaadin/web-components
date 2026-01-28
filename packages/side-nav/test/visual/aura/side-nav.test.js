import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../not-animated-styles.js';
import '../../../vaadin-side-nav.js';
import '@vaadin/icon';
import '@vaadin/icons';

describe('side-nav', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  beforeEach(async () => {
    element = fixtureSync(
      `
        <vaadin-side-nav collapsible>
          <span slot="label">Messages</span>
          <vaadin-side-nav-item path="/inbox">
            <vaadin-icon icon="vaadin:inbox" slot="prefix"></vaadin-icon>
            <span>Inbox</span>
          </vaadin-side-nav-item>
          <vaadin-side-nav-item path="/sent">
            <vaadin-icon icon="vaadin:paperplane" slot="prefix"></vaadin-icon>
            <span>Sent</span>
          </vaadin-side-nav-item>
          <vaadin-side-nav-item path="/trash">
            <vaadin-icon icon="vaadin:trash" slot="prefix"></vaadin-icon>
            <span>Trash</span>
          </vaadin-side-nav-item>
        </vaadin-side-nav>
        `,
      div,
    );
    await nextRender();
  });

  it('current item', async () => {
    const item = document.querySelector('vaadin-side-nav-item');
    item.setAttribute('current', '');
    await visualDiff(div, 'current-item');
  });

  it('current item', async () => {
    const item = document.querySelector('vaadin-side-nav-item');
    item.setAttribute('current', '');
    element.setAttribute('theme', 'filled');
    await visualDiff(div, 'current-filled-item');
  });

  it('current collapsed item', async () => {
    const item = document.querySelector('vaadin-side-nav-item');
    item.setAttribute('current', '');
    const child = document.createElement('vaadin-side-nav-item');
    child.setAttribute('slot', 'children');
    item.appendChild(child);
    await visualDiff(div, 'current-collapsed-item');
  });

  it('disabled item', async () => {
    const item = document.querySelector('vaadin-side-nav-item');
    item.disabled = true;
    await nextRender();
    await visualDiff(div, 'disabled-item');
  });
});
