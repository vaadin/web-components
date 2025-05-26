import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-avatar-group.js';

describe('avatar-group', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync(
      `<vaadin-avatar-group></vaadin-avatar-group>
      <style>
        html {
          --vaadin-user-color-0: royalblue;
          --vaadin-user-color-1: green;
          --vaadin-user-color-2: orange;
          --vaadin-user-color-3: purple;
        }
      </style>`,
      div,
    );
  });

  it('basic', async () => {
    element.items = [{ name: 'Abc Def' }, { name: 'Ghi Jkl' }, { name: 'Mno Pqr' }, { name: 'Stu Vwx' }];
    await visualDiff(div, 'basic');
  });

  it('max-items-visible', async () => {
    element.maxItemsVisible = 3;
    element.items = [{ name: 'Abc Def' }, { name: 'Ghi Jkl' }, { name: 'Mno Pqr' }, { name: 'Stu Vwx' }];
    await visualDiff(div, 'max-items-visible');
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

  it('opened', async () => {
    document.body.style.height = '200px';
    document.body.style.width = '220px';
    element.maxItemsVisible = 3;
    element.items = [{ name: 'Abc Def' }, { name: 'Ghi Jkl' }, { name: 'Mno Pqr' }, { name: 'Stu Vwx' }];
    await nextRender();
    element._overflow.click();
    await nextRender();
    await visualDiff(document.body, 'opened');
  });

  it('avatar-size', async () => {
    element.items = [{ name: 'Abc Def' }, { name: 'Ghi Jkl' }, { name: 'Mno Pqr' }, { name: 'Stu Vwx' }];
    element.style.setProperty('--vaadin-avatar-size', '45px');
    await visualDiff(div, 'avatar-size');
  });
});
