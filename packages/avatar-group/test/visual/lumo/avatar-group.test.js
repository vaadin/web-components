import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-avatar-group.js';

describe('avatar-group', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-avatar-group></vaadin-avatar-group>', div);
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
      { abbr: '44', colorIndex: 4 },
      { abbr: '55', colorIndex: 5 },
      { abbr: '66', colorIndex: 6 },
    ];
    await visualDiff(div, 'color-index');
  });

  it('opened', async () => {
    document.body.style.height = '200px';
    document.body.style.width = '220px';
    element.maxItemsVisible = 3;
    element.items = [{ name: 'Abc Def' }, { name: 'Ghi Jkl' }, { name: 'Mno Pqr' }, { name: 'Stu Vwx' }];
    element.$.overflow.click();
    await nextRender(element);
    await visualDiff(document.body, 'opened');
  });

  it('avatar-size', async () => {
    element.items = [{ name: 'Abc Def' }, { name: 'Ghi Jkl' }, { name: 'Mno Pqr' }, { name: 'Stu Vwx' }];
    element.style.cssText += '--vaadin-avatar-size: 45px';
    element.$.overflow.click();
    await visualDiff(div, 'avatar-size');
  });
});
