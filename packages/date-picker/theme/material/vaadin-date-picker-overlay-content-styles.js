import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/button/theme/material/vaadin-button-styles.js';
import './vaadin-date-picker-year-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-date-picker-overlay-content',
  css`
    :host {
      background: var(--material-background-color);
      font-family: var(--material-font-family);
      font-size: var(--material-body-font-size);
      -webkit-text-size-adjust: 100%;
      line-height: 1.4;
    }

    :host([fullscreen]) {
      position: absolute;
    }

    [part='overlay-header'] {
      display: flex;
      align-items: baseline;
      position: relative;
      color: var(--material-body-text-color);
      background: var(--material-secondary-background-color);
      border-bottom: 2px solid var(--material-primary-color);
      padding: 8px;
      box-shadow: var(--material-shadow-elevation-4dp);
    }

    [part='label'] {
      padding: 0 8px;
      flex: auto;
    }

    [part='clear-button'],
    [part='toggle-button'] {
      font-family: 'material-icons';
      font-size: var(--material-icon-font-size);
      line-height: 24px;
      width: 24px;
      height: 24px;
      text-align: center;
      padding: 8px;
      color: var(--material-secondary-text-color);
    }

    [part='clear-button']:hover,
    [part='toggle-button']:hover,
    [part='years-toggle-button']:hover {
      color: inherit;
    }

    [part='clear-button']::before {
      content: var(--material-icons-clear);
    }

    [part='toggle-button']::before {
      content: var(--material-icons-calendar);
    }

    [part='years-toggle-button'] {
      padding: 4px 8px;
      font-size: var(--material-body-font-size);
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0.05em;
      color: var(--material-secondary-text-color);
    }

    [part='years-toggle-button']::after {
      content: var(--material-icons-play);
      display: inline-block;
      width: 24px;
      font-family: 'material-icons';
      font-size: var(--material-icon-font-size);
      line-height: 24px;
      text-align: center;
      transition: transform 100ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host([years-visible]) [part='years-toggle-button']::after {
      transform: rotate(90deg);
    }

    ::slotted([slot='months']) {
      --vaadin-infinite-scroller-item-height: 328px;
      text-align: center;
    }

    ::slotted([slot='years']) {
      background: var(--material-secondary-text-color);
      color: var(--material-background-color);
      font-size: var(--material-body-font-size);
      font-weight: 400;
      line-height: 1.4;
      text-align: center;
    }

    ::slotted([slot='years'])::before {
      border: 0;
      width: 8px;
      height: 8px;
      transform: translateX(-50%) rotate(-45deg);
      background: var(--material-background-color);
    }

    [part='toolbar'] {
      display: flex;
      justify-content: flex-end;
      padding: 8px 4px;
      border-top: 1px solid var(--material-divider-color);
    }

    ::slotted([slot='cancel-button']) {
      order: 1;
    }

    ::slotted([slot='today-button']) {
      order: 2;
    }

    ::slotted(vaadin-button) {
      margin: 0 4px;
    }
  `,
  { moduleId: 'material-date-picker-overlay-content' },
);
