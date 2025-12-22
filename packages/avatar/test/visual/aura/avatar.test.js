import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-avatar.js';

describe('avatar', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-avatar></vaadin-avatar>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('filled', async () => {
    element.setAttribute('theme', 'filled');
    await visualDiff(div, 'filled');
  });

  it('color-index', async () => {
    element.setAttribute('has-color-index', '');
    element.style.setProperty('--vaadin-avatar-user-color', 'green');
    await visualDiff(div, 'color-index');
  });

  it('color-index filled', async () => {
    element.setAttribute('has-color-index', '');
    element.setAttribute('theme', 'filled');
    element.style.setProperty('--vaadin-avatar-user-color', 'green');
    await visualDiff(div, 'color-index-filled');
  });
});
