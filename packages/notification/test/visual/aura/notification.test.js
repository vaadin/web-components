import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
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
      await visualDiff(document.body, position);
    });
  });
});

describe('variants', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-notification duration="0"></vaadin-notification>');
    element.renderer = (root) => {
      root.textContent = 'Notification';
    };
  });

  afterEach(() => {
    element.opened = false;
  });

  describe('class', () => {
    ['v-info', 'v-warning', 'v-error', 'v-success'].forEach((variant) => {
      it(variant, async () => {
        element.overlayClass = variant;
        element.opened = true;
        await nextRender();
        const notification = document.querySelector('vaadin-notification-card');
        await visualDiff(notification, `class-${variant}`);
      });
    });
  });

  describe('theme', () => {
    ['info', 'warning', 'error', 'success'].forEach((variant) => {
      it(variant, async () => {
        element.setAttribute('theme', variant);
        element.opened = true;
        await nextRender();
        const notification = document.querySelector('vaadin-notification-card');
        await visualDiff(notification, `theme-${variant}`);
      });
    });
  });
});
