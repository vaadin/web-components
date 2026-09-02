import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-message-list.js';

describe('message-list', () => {
  let div, element;

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
    await visualDiff(div, 'basic');
  });

  describe('bubble', () => {
    beforeEach(async () => {
      div = document.createElement('div');
      div.style.padding = '10px';
      div.style.width = '400px';

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
          text: 'A message long enough to wrap onto several lines, so that the width restriction of the bubble applies to it',
          time: 'right now',
          userName: 'Linsey Listy',
          userAbbr: 'LL',
          userColorIndex: 2,
          theme: 'self',
        },
        {
          text: 'A message from a user without a color index',
          time: 'right now',
          userName: 'Nils Nocolor',
          userAbbr: 'NN',
          theme: 'self',
          attachments: [{ name: 'report.pdf' }],
        },
        {
          text: 'A full-width message, long enough to show that the width restriction of the bubble does not apply to it',
          time: 'right now',
          userName: 'Ada Assistant',
          userAbbr: 'AA',
          userColorIndex: 3,
          theme: 'full-width',
        },
      ];
      await nextRender();
    });

    ['bubble', 'bubble one-to-one'].forEach((theme) => {
      it(theme, async () => {
        element.setAttribute('theme', theme);
        await nextRender();
        await visualDiff(div, theme.replaceAll(' ', '-'));
      });
    });
  });

  describe('typing indicator', () => {
    const users = {
      single: [{ name: 'Linsey Listy', abbr: 'LL', colorIndex: 2 }],
      multiple: [
        { name: 'Linsey Listy', abbr: 'LL', colorIndex: 2 },
        { name: 'Matt Mambo', abbr: 'MM', colorIndex: 1 },
      ],
    };

    const types = {
      default: 'on',
      ellipsis: 'ellipsis',
      minimal: 'minimal',
    };

    before(() => {
      Object.defineProperty(navigator, 'language', { configurable: true, value: 'en-US' });
    });

    after(() => {
      delete navigator.language;
    });

    beforeEach(async () => {
      div = document.createElement('div');
      div.style.padding = '10px';
      div.style.width = '400px';

      element = fixtureSync('<vaadin-message-list></vaadin-message-list>', div);
      element.items = [
        {
          text: 'Hello list',
          time: 'yesterday',
          userName: 'Matt Mambo',
          userAbbr: 'MM',
          userColorIndex: 1,
        },
      ];
      await nextRender();
    });

    Object.entries(types).forEach(([typeName, type]) => {
      Object.entries(users).forEach(([userCount, typingUsers]) => {
        ['default', 'bubble'].forEach((variant) => {
          it(`${typeName} - ${userCount} - ${variant}`, async () => {
            if (variant === 'bubble') {
              element.setAttribute('theme', 'bubble');
            }
            element._typingIndicatorType = type;
            element._usersTyping = typingUsers;
            await nextRender();
            await nextFrame();

            await visualDiff(div, `typing-indicator-${typeName}-${userCount}-${variant}`);
          });
        });
      });
    });
  });
});
