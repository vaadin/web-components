import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of Lumo needed for unit tests to pass.
// These should be eventually covered by base styles.
registerStyles(
  'vaadin-menu-bar',
  css`
    ::slotted(vaadin-menu-bar-button) {
      box-sizing: border-box;
      min-width: 4.5rem;
      margin: 2px;
      padding: 0 14px;
      margin-inline-start: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif;
    }

    ::slotted([slot='overflow']) {
      min-width: 2.25rem;
      padding-left: 0.5625rem;
      padding-right: 0.5625rem;
    }

    /* Used for testing overflow detection on theme change */
    :host([theme='big']) ::slotted(vaadin-menu-bar-button) {
      width: 100px;
    }
  `,
  { moduleId: 'vaadin-menu-bar-test-styles' },
);

registerStyles(
  'vaadin-menu-bar-item',
  css`
    :host {
      display: flex;
      min-height: 2.25rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif;
    }

    [part='checkmark']::before {
      display: block;
      content: '';
      font-size: 1.5em;
      line-height: 1;
      width: 1em;
      height: 1em;
    }
  `,
  { moduleId: 'vaadin-menu-bar-test-styles' },
);
