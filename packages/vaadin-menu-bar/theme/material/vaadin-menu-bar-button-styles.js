import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/button/theme/material/vaadin-button.js';

registerStyles(
  'vaadin-menu-bar-button',
  css`
    [part='label'] {
      width: 100%;
    }

    [part='label'] ::slotted(vaadin-context-menu-item) {
      line-height: 20px;
      margin: -8px;
      padding: 8px;
      justify-content: center;
    }

    :host([theme='outlined']),
    :host([theme='contained']) {
      border-radius: 0;
    }

    :host([theme~='contained']) ::slotted(vaadin-context-menu-item),
    :host([theme~='outlined']) ::slotted(vaadin-context-menu-item) {
      margin: -8px -16px;
      padding: 8px 16px;
    }

    :host([expanded])::before {
      opacity: 0.08;
      transition: opacity 0.4s;
    }

    :host([expanded])::after {
      transform: translate(-50%, -50%) scale(0.0000001); /* animation works weirdly with scale(0) */
      opacity: 0.1;
      transition: 0s;
    }

    :host([theme='contained'][expanded]) {
      box-shadow: var(--material-shadow-elevation-8dp);
    }

    :host(:hover:not([expanded]))::after {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }

    :host([theme='contained']:not([dir='rtl'])) {
      margin-right: 1px;
    }

    :host(:first-of-type) {
      border-radius: 4px 0 0 4px;
    }

    :host(:nth-last-of-type(2)),
    :host([slot='overflow']) {
      border-radius: 0 4px 4px 0;
    }

    :host([slot='overflow']) {
      padding-right: 8px;
      padding-left: 8px;
      min-width: 36px;
    }

    :host([slot='overflow']) ::slotted(*) {
      font-size: 24px;
    }

    :host([theme='outlined']:not([dir='rtl'])) {
      margin-right: -1px;
    }

    :host([theme='outlined']:not([dir='rtl']):nth-last-of-type(2)),
    :host([theme='outlined']:not([dir='rtl'])[slot='overflow']) {
      margin-right: 0;
    }

    :host([theme='text']),
    :host(:not([theme])) {
      border-radius: 4px;
    }

    /* RTL styles */
    :host([dir='rtl']:first-of-type) {
      border-radius: 0 4px 4px 0;
    }

    :host([dir='rtl']:nth-last-of-type(2)),
    :host([dir='rtl'][slot='overflow']) {
      border-radius: 4px 0 0 4px;
    }

    :host([dir='rtl'][theme='contained']) {
      margin-left: 1px;
    }

    :host([dir='rtl'][theme='outlined']) {
      margin-left: -1px;
    }

    :host([theme='outlined'][dir='rtl']:nth-last-of-type(2)),
    :host([theme='outlined'][dir='rtl'][slot='overflow']) {
      margin-left: 0;
    }
  `,
  { include: ['material-button'], moduleId: 'material-menu-bar-button' }
);
