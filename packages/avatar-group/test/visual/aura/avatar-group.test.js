import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-avatar-group.js';

describe('avatar-group', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-avatar-group></vaadin-avatar-group>', div);
  });

  it('basic', async () => {
    element.items = [{}, { abbr: '11' }, { abbr: '22' }, { abbr: '33' }];
    await visualDiff(div, 'basic');
  });

  it('filled', async () => {
    element.items = [{}, { abbr: '11' }, { abbr: '22' }, { abbr: '33' }];
    element.setAttribute('theme', 'filled');
    await visualDiff(div, 'filled');
  });

  it('color-index', async () => {
    element.items = [
      { colorIndex: 0 },
      { abbr: '11', colorIndex: 1 },
      { abbr: '22', colorIndex: 2 },
      { abbr: '33', colorIndex: 3 },
    ];
    await visualDiff(div, 'color-index');
  });

  it('color-index filled', async () => {
    element.items = [
      { colorIndex: 0 },
      { abbr: '11', colorIndex: 1 },
      { abbr: '22', colorIndex: 2 },
      { abbr: '33', colorIndex: 3 },
    ];
    element.setAttribute('theme', 'filled');
    await visualDiff(div, 'color-index-filled');
  });
});
