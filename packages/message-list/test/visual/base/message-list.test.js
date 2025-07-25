import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-message-list.js';

describe('message-list', () => {
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
        beforeEach(async () => {
          div = document.createElement('div');
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-message-list></vaadin-message-list>', div);
          element.items = [
            {
              text: 'Hello list',
              time: 'yesterday',
              userName: 'Matt Mambo',
              userAbbr: 'MM',
              userColorIndex: 1,
            },
            {
              text: 'Another message',
              time: 'right now',
              userName: 'Linsey Listy',
              userAbbr: 'LL',
              userColorIndex: 2,
              userImg:
                'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PHBhdGggZmlsbD0iIzAyMDIwMSIgZD0iTTQ1NC40MjYgMzkyLjU4MmMtNS40MzktMTYuMzItMTUuMjk4LTMyLjc4Mi0yOS44MzktNDIuMzYyLTI3Ljk3OS0xOC41NzItNjAuNTc4LTI4LjQ3OS05Mi4wOTktMzkuMDg1LTcuNjA0LTIuNjY0LTE1LjMzLTUuNTY4LTIyLjI3OS05LjctNi4yMDQtMy42ODYtOC41MzMtMTEuMjQ2LTkuOTc0LTE3Ljg4Ni0uNjM2LTMuNTEyLTEuMDI2LTcuMTE2LTEuMjI4LTEwLjY2MSAyMi44NTctMzEuMjY3IDM4LjAxOS04Mi4yOTUgMzguMDE5LTEyNC4xMzYgMC02NS4yOTgtMzYuODk2LTgzLjQ5NS04Mi40MDItODMuNDk1LTQ1LjUxNSAwLTgyLjQwMyAxOC4xNy04Mi40MDMgODMuNDY4IDAgNDMuMzM4IDE2LjI1NSA5Ni41IDQwLjQ4OSAxMjcuMzgzLS4yMjEgMi40MzgtLjUxMSA0Ljg3Ni0uOTUgNy4zMDMtMS40NDQgNi42MzktMy43NyAxNC4wNTgtOS45NyAxNy43NDMtNi45NTcgNC4xMzMtMTQuNjgyIDYuNzU2LTIyLjI4NyA5LjQyLTMxLjUyMSAxMC42MDUtNjQuMTE5IDE5Ljk1Ny05Mi4wOTEgMzguNTI5LTE0LjU0OSA5LjU4LTI0LjQwMyAyNy4xNTktMjkuODM4IDQzLjQ3OS01LjU5NyAxNi45MzgtNy44ODYgMzcuOTE3LTcuNTQxIDU0LjkxN2g0MTEuOTMyYy4zNDgtMTYuOTk5LTEuOTQ2LTM3Ljk3OC03LjUzOS01NC45MTd6Ii8+PC9zdmc+Cg==',
            },
            {
              text: 'Third message',
              time: 'right now',
              userName: 'Linsey Listy',
              userAbbr: 'LL',
              userColorIndex: 3,
            },
          ];
          await nextRender();
        });

        it('basic', async () => {
          await visualDiff(div, `${dir}-basic`);
        });

        it('focused', async () => {
          element.querySelectorAll('vaadin-message')[0].focus();
          await sendKeys({ press: 'ArrowDown' });
          await visualDiff(div, `${dir}-focused`);
        });

        it('markdown', async () => {
          element.items[0].text = 'This is a **bold text** in Markdown';
          element.items = [...element.items];
          element.markdown = true;
          await customElements.whenDefined('vaadin-markdown');
          await nextFrame();
          await visualDiff(div, `${dir}-markdown`);
        });

        it('markdown - margin overrides', async () => {
          // Override the default margins in application styles with a stronger selector
          fixtureSync(`
            <style>
              vaadin-message-list p {
                margin: 20px;
              }
            </style>
          `);

          element.markdown = true;
          await customElements.whenDefined('vaadin-markdown');
          await nextFrame();
          await visualDiff(div, `${dir}-markdown-margin-overrides`);
        });
      });
    });
  });
});
