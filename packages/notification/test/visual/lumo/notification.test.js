import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/components/button.css';
import '@vaadin/vaadin-lumo-styles/components/notification.css';
import '@vaadin/button';
import '../../not-animated-styles.js';
import '../../../vaadin-notification.js';

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
      await nextRender();
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
