import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-message.js';

describe('message', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync(
      `<vaadin-message>There is no real ending. It's just the place where you stop the story.</vaadin-message>`,
      div,
    );
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('time', async () => {
    element.time = '2021-01-28 10:43';
    await visualDiff(div, 'time');
  });

  it('userName', async () => {
    element.userName = 'Bob Ross';
    await visualDiff(div, 'user-name');
  });

  it('userName time', async () => {
    element.userName = 'Bob Ross';
    element.time = 'Moments ago';
    await visualDiff(div, 'user-name-time');
  });

  it('userAbbr', async () => {
    element.userAbbr = 'AF';
    await visualDiff(div, 'user-abbr');
  });
});
