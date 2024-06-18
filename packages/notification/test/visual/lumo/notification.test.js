import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../not-animated-styles.js';
import '../../../theme/lumo/vaadin-notification.js';
import '../../../../button/theme/lumo/vaadin-button.js';

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
describe('themes', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-notification duration="0"></vaadin-notification>');
    element.renderer = (root) => {
      root.innerHTML = '<vaadin-button>Button</vaadin-button>';
    };
    element.opened = true;
  });

  afterEach(() => {
    element.opened = false;
  });

  ['primary', 'warning', 'success', 'error'].forEach((variant) => {
    it(variant, async () => {
      element.setAttribute('theme', variant);
      const notification = document.querySelector('vaadin-notification-card');

      await sendKeys({ press: 'Tab' });
      await visualDiff(notification, `notification-${variant}-focus-ring-contrast`);
    });
  });
});
