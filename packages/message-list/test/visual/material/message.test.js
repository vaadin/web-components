import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-message.js';

describe('message', () => {
  let div, element;

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('basic', () => {
        beforeEach(() => {
          div = document.createElement('div');
          div.style.padding = '10px';
          element = fixtureSync(
            `<vaadin-message>There is no real ending. It's just the place where you stop the story.</vaadin-message>`,
            div,
          );
        });

        it('basic', async () => {
          await visualDiff(div, `${dir}-basic`);
        });

        it('time', async () => {
          element.time = '2021-01-28 10:43';
          await visualDiff(div, `${dir}-time`);
        });

        it('userName', async () => {
          element.userName = 'Bob Ross';
          await visualDiff(div, `${dir}-user-name`);
        });

        it('userName time', async () => {
          element.userName = 'Bob Ross';
          element.time = 'Moments ago';
          await visualDiff(div, `${dir}-user-name-time`);
        });

        it('userAbbr', async () => {
          element.userAbbr = 'AF';
          await visualDiff(div, `${dir}-user-abbr`);
        });

        it('userImg', async () => {
          /* prettier-ignore */
          element.userImg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PHBhdGggZmlsbD0iIzAyMDIwMSIgZD0iTTQ1NC40MjYgMzkyLjU4MmMtNS40MzktMTYuMzItMTUuMjk4LTMyLjc4Mi0yOS44MzktNDIuMzYyLTI3Ljk3OS0xOC41NzItNjAuNTc4LTI4LjQ3OS05Mi4wOTktMzkuMDg1LTcuNjA0LTIuNjY0LTE1LjMzLTUuNTY4LTIyLjI3OS05LjctNi4yMDQtMy42ODYtOC41MzMtMTEuMjQ2LTkuOTc0LTE3Ljg4Ni0uNjM2LTMuNTEyLTEuMDI2LTcuMTE2LTEuMjI4LTEwLjY2MSAyMi44NTctMzEuMjY3IDM4LjAxOS04Mi4yOTUgMzguMDE5LTEyNC4xMzYgMC02NS4yOTgtMzYuODk2LTgzLjQ5NS04Mi40MDItODMuNDk1LTQ1LjUxNSAwLTgyLjQwMyAxOC4xNy04Mi40MDMgODMuNDY4IDAgNDMuMzM4IDE2LjI1NSA5Ni41IDQwLjQ4OSAxMjcuMzgzLS4yMjEgMi40MzgtLjUxMSA0Ljg3Ni0uOTUgNy4zMDMtMS40NDQgNi42MzktMy43NyAxNC4wNTgtOS45NyAxNy43NDMtNi45NTcgNC4xMzMtMTQuNjgyIDYuNzU2LTIyLjI4NyA5LjQyLTMxLjUyMSAxMC42MDUtNjQuMTE5IDE5Ljk1Ny05Mi4wOTEgMzguNTI5LTE0LjU0OSA5LjU4LTI0LjQwMyAyNy4xNTktMjkuODM4IDQzLjQ3OS01LjU5NyAxNi45MzgtNy44ODYgMzcuOTE3LTcuNTQxIDU0LjkxN2g0MTEuOTMyYy4zNDgtMTYuOTk5LTEuOTQ2LTM3Ljk3OC03LjUzOS01NC45MTd6Ii8+PC9zdmc+Cg==';
          await visualDiff(div, `${dir}-user-img`);
        });

        it('userColorIndex', async () => {
          element.userColorIndex = 3;
          await visualDiff(div, `${dir}-user-color-index`);
        });
      });
    });
  });
});
