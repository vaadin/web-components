import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-notification.js';

describe('notification', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-notification duration="0"></vaadin-notification>');
    element.renderer = (root) => {
      root.textContent = element.position;
    };
  });

  afterEach(() => {
    element.opened = false;
  });

  [
    'top-stretch',
    'top-start',
    'top-center',
    'top-end',
    'middle',
    'bottom-start',
    'bottom-center',
    'bottom-end',
    'bottom-stretch',
  ].forEach((position) => {
    it(position, async () => {
      element.position = position;
      element.opened = true;
      await nextRender(element);
      await visualDiff(document.body, `${position}`);
    });
  });
});
