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

  describe('accent', () => {
    ['neutral', 'green', 'yellow', 'purple', 'orange', 'blue', 'red'].forEach((color) => {
      it(color, async () => {
        element.classList.add(`aura-accent-${color}`);
        await visualDiff(div, `accent-${color}`);
      });
    });
  });

  it('theme-xlarge', async () => {
    element.setAttribute('theme', 'xlarge');
    await visualDiff(div, 'theme-xlarge');
  });

  it('theme-large', async () => {
    element.setAttribute('theme', 'large');
    await visualDiff(div, 'theme-large');
  });

  it('theme-small', async () => {
    element.setAttribute('theme', 'small');
    await visualDiff(div, 'theme-small');
  });

  it('theme-xsmall', async () => {
    element.setAttribute('theme', 'xsmall');
    await visualDiff(div, 'theme-xsmall');
  });

  it('abbr theme-xlarge', async () => {
    element.abbr = 'YY';
    element.setAttribute('theme', 'xlarge');
    await visualDiff(div, 'abbr-theme-xlarge');
  });

  it('abbr theme-large', async () => {
    element.abbr = 'YY';
    element.setAttribute('theme', 'large');
    await visualDiff(div, 'abbr-theme-large');
  });

  it('abbr theme-small', async () => {
    element.abbr = 'YY';
    element.setAttribute('theme', 'small');
    await visualDiff(div, 'abbr-theme-small');
  });

  it('abbr theme-xsmall', async () => {
    element.abbr = 'YY';
    element.setAttribute('theme', 'xsmall');
    await visualDiff(div, 'abbr-theme-xsmall');
  });
});
