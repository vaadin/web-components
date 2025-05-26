import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/tooltip/test/not-animated-styles.js';
import '../../../theme/lumo/vaadin-avatar.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';

describe('avatar', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-avatar></vaadin-avatar>', div);
  });

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('name', async () => {
    element.name = 'Foo Bar';
    await visualDiff(div, 'name');
  });

  it('name', async () => {
    element.abbr = 'YY';
    await visualDiff(div, 'abbr');
  });

  it('img', async () => {
    /* prettier-ignore */
    element.img = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PHBhdGggZmlsbD0iIzAyMDIwMSIgZD0iTTQ1NC40MjYgMzkyLjU4MmMtNS40MzktMTYuMzItMTUuMjk4LTMyLjc4Mi0yOS44MzktNDIuMzYyLTI3Ljk3OS0xOC41NzItNjAuNTc4LTI4LjQ3OS05Mi4wOTktMzkuMDg1LTcuNjA0LTIuNjY0LTE1LjMzLTUuNTY4LTIyLjI3OS05LjctNi4yMDQtMy42ODYtOC41MzMtMTEuMjQ2LTkuOTc0LTE3Ljg4Ni0uNjM2LTMuNTEyLTEuMDI2LTcuMTE2LTEuMjI4LTEwLjY2MSAyMi44NTctMzEuMjY3IDM4LjAxOS04Mi4yOTUgMzguMDE5LTEyNC4xMzYgMC02NS4yOTgtMzYuODk2LTgzLjQ5NS04Mi40MDItODMuNDk1LTQ1LjUxNSAwLTgyLjQwMyAxOC4xNy04Mi40MDMgODMuNDY4IDAgNDMuMzM4IDE2LjI1NSA5Ni41IDQwLjQ4OSAxMjcuMzgzLS4yMjEgMi40MzgtLjUxMSA0Ljg3Ni0uOTUgNy4zMDMtMS40NDQgNi42MzktMy43NyAxNC4wNTgtOS45NyAxNy43NDMtNi45NTcgNC4xMzMtMTQuNjgyIDYuNzU2LTIyLjI4NyA5LjQyLTMxLjUyMSAxMC42MDUtNjQuMTE5IDE5Ljk1Ny05Mi4wOTEgMzguNTI5LTE0LjU0OSA5LjU4LTI0LjQwMyAyNy4xNTktMjkuODM4IDQzLjQ3OS01LjU5NyAxNi45MzgtNy44ODYgMzcuOTE3LTcuNTQxIDU0LjkxN2g0MTEuOTMyYy4zNDgtMTYuOTk5LTEuOTQ2LTM3Ljk3OC03LjUzOS01NC45MTd6Ii8+PC9zdmc+Cg==';
    await visualDiff(div, 'img');
  });

  it('color-index', async () => {
    element.colorIndex = '0';
    await visualDiff(div, 'color-index');
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

  it('avatar-size', async () => {
    element.style.setProperty('--vaadin-avatar-size', '45px');
    await visualDiff(div, 'avatar-size');
  });

  it('tooltip', async () => {
    div.style.width = '90px';
    div.style.height = '90px';
    div.style.textAlign = 'center';
    element.withTooltip = true;
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'tooltip');
  });
});
