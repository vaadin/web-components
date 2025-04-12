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
      line-height: 1.4;
      -webkit-text-size-adjust: 100%;
    }

    :host([fullscreen]) {
      position: absolute;
    }

    [part='overlay-header'] {
      position: relative;
      display: flex;
      align-items: baseline;
      padding: 8px;
      border-bottom: 2px solid var(--material-primary-color);
      background: var(--material-secondary-background-color);
      box-shadow: var(--material-shadow-elevation-4dp);
      color: var(--material-body-text-color);
    }

    [part='label'] {
      flex: auto;
      padding: 0 8px;
    }

    [part='clear-button'],
    [part='toggle-button'] {
      width: 24px;
      height: 24px;
      padding: 8px;
      color: var(--material-secondary-text-color);
      font-family: 'material-icons';
      font-size: var(--material-icon-font-size);
      line-height: 24px;
      text-align: center;
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
      color: var(--material-secondary-text-color);
      font-size: var(--material-body-font-size);
      font-weight: 500;
      letter-spacing: 0.05em;
      line-height: 24px;
    }

    [part='years-toggle-button']::after {
      display: inline-block;
      width: 24px;
      content: var(--material-icons-play);
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
      width: 8px;
      height: 8px;
      border: 0;
      background: var(--material-background-color);
      transform: translateX(-50%) rotate(-45deg);
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
