import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/tooltip/test/not-animated-styles.js';
import '../../../theme/lumo/vaadin-avatar.js';
import { Tooltip } from '../../../src/vaadin-tooltip.js';

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

  /**
   * Tests that images rendered in <vaadin-avatar> preserve their aspect ratio using object-fit: cover, instead of being
   * stretched. Uses the Vaadin `}` as test image, which is higher than it is wide.
   */
  it('aspect-ratio', async () => {
    /* prettier-ignore */
    element.img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABGCAYAAADb7SQ4AAABeWlDQ1BJQ0MgUHJvZmlsZQAAKJF9kE0rRFEYx38GESOFBWVxY1gNMWpio8wklMU0KG+bO3fe1Lzc7lwhGwtlqyix8bbgE7CxUNZKKVKy8wWIjXQ9x4zGS3nqOc/vPOc5/875g8urm2aqrAvSGdsKDwW0yalpreKRcpqow027buTMgVBoFImv+jNebyhR9bpDaf09/zeqo7GcASWVwv2GadnCw8KtC7apWOk1WPIo4RXFiTxvKo7k+fhzZjwcFD4T1oykHhW+F/YaSSsNLqXviXybSXzjdGreKLxH/cQdy0yMSW2RbCZHmCECaIwwSBA/3fTJ6qcDH52yw44t2upyMGsuWXOJpK0NiBMxbSRjdHo1X5dPZpSvv/0q9rJ70PsCpevFXmQLTteg8a7Y8+xC7SqcXJi6pX+2SiVd8Tg8HUHNFNRfQdVMLt7jy//IHYDyB8d5boOKDXhfd5y3fcd5P5DL4tF5Ju9RQYvDWxhfhtFL2N6BdtGunf0AHOpnKSG+GKUAAACYZVhJZk1NACoAAAAIAAYBEgADAAAAAQABAAABGgAFAAAAAQAAAFYBGwAFAAAAAQAAAF4BKAADAAAAAQACAAABMgACAAAAFAAAAGaHaQAEAAAAAQAAAHoAAAAAAAAASAAAAAEAAABIAAAAATIwMjE6MDU6MjUgMTg6MTE6NTQAAAKgAgAEAAAAAQAAAB6gAwAEAAAAAQAAAEYAAAAASCyRNQAAAAlwSFlzAAALEwAACxMBAJqcGAAABklpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjMwMDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj43MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDx0aWZmOkltYWdlV2lkdGg+MzAwPC90aWZmOkltYWdlV2lkdGg+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkltYWdlTGVuZ3RoPjcwPC90aWZmOkltYWdlTGVuZ3RoPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZmZpbml0eSBEZXNpZ25lciAxLjkuMzwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5wcm9kdWNlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIxLTA1LTI1VDE4OjExOjU0KzAyOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDIxLTA1LTI1VDE4OjExOjU0KzAyOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyMS0wNS0yNVQxODoxMTo1NCswMjowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHBob3Rvc2hvcDpJQ0NQcm9maWxlPnNSR0IgSUVDNjE5NjYtMi4xPC9waG90b3Nob3A6SUNDUHJvZmlsZT4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cox8CL8AAAOgSURBVGgF7Vo9aBRBFH5vE1ES410kgqKFYiwUBdEEtBEEY5FLxCIWaqWNP6U2dqZICkGx1kJBUCsVuds0SRoLUYwQUCIooqLGiHC581AJudvxvdtsbrM3t/cmm+v2wdzMvPe9982+mYWZnUPwJD3dAtg6DKBOkGqzp9bUX0DBBCC8AnBs6Fv/VoOpq8JFRCb/lEiPLfZljSIgDkHLumE4jEWZi4tyiTPZ3QDWGxPHAHYCVPE49Hd8D+hrdq2yRcG2mgiZoQuw+a4M6qJc4qZVL6irTBw12B6wc+c0eq3KJe5t+0VzdVOLMFEquA6j2YTExSVmZCpxmX4vUhmnFfuV6m9UClRMZC3MWd0Sh8qq1qGVQrDz+8h0mwrXErkCfclr9YCVJ9YhERUFeU2mI7QEfuggGl2XRlelCif24H3JWQC843XDa9wYbnetMmLGIk5JAkoxcmJHlaRBJTg5sSSaASYmNkhWNGic6mj5M/COU22QrGjQONXR8mfgHac6JFlqLsRobJKnurnpnSy6s12CkxO/bPtAAf/VD4qbIJOjzWG4yIkH0aGzxv3wcJ5V3QN79pDX09Xh++qgx0hhAzil96ROBk01+pwlLjO0WRynQ8MDD2dGzF7pbD+g9ZBarV4Qca3gEfQnBxhvTsxe9uxeUPiEWlu5aySIp/nJ5XPsj55qn4S/iU4a9lEqfDydpEKbfoEo8iFZHjF7TtFSU6pIv/PU468B0n13+TjczDGMxc7uAZV/TDPVaeyLMMo+5k+czveCsp6TrzkpL66FlW22uNK/OwAdfp3aedQC8b9OY0TKb0NZzFKNzhB5CUhxmgZ4ElLtzxZ4qir5Ew8qC7ry/IWgpSpKtaKHztVj1eqKRj7H3QWeUwEpHeDrkDK9nBhKOyvjDWtZH8Osnk1O7OAaz2klajnxSrD5YsTEvmQ0thmnurH59UWPU+1LRmObcaobm19f9DjVvmQEmhY2BTSRuvJUK7UrElPAWUacydHOUp0N+NboqpkahiXqcGK+/snk9pMH7RjpwC2TCQls6b46k7tAZ6EB2gLuoJrvnPjWrE0SyIfh66K6UiG28zfoEHaJ6KLcMhZgtUP3yvXF3dC7J/2fBJdv8HWxEc5DKnlLZwrq3DkuzR+ITAp0ChSS8iBcYoRPwREZ9vni+oyJj0tcvudHuqo3FjqU41VoTRw0uS1nlsriUn9OLfw5gT+ObAkZwmey0RPSnxPQGVnunxP+A4MGyxoOtdJvAAAAAElFTkSuQmCC';
    await visualDiff(div, 'aspect-ratio');
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
