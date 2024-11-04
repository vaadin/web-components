import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/button/theme/material/vaadin-button-styles.js';
import '@vaadin/progress-bar/theme/material/vaadin-progress-bar-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-upload',
  css`
    :host(:not([nodrop])) {
      overflow: hidden;
      border: 1px dashed var(--material-divider-color);
      border-radius: 4px;
      padding: 8px 16px;
      transition: border-color 0.6s;
      position: relative;
    }

    [part='primary-buttons'] {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: baseline;
    }

    ::slotted([slot='add-button']) {
      margin: 0 -8px;
    }

    [part='drop-label'] {
      text-align: center;
      white-space: normal;
      padding: 0 24px;
      color: var(--material-secondary-text-color);
      font-family: var(--material-font-family);
      font-size: var(--material-small-font-size);
    }

    :host([dragover-valid]) {
      border-color: var(--material-primary-color);
      transition: border-color 0.1s;
    }

    :host([dragover-valid]) [part='drop-label'] {
      color: var(--material-primary-text-color);
    }

    :host([disabled]) [part='drop-label'],
    :host([max-files-reached]) [part='drop-label'] {
      color: var(--material-disabled-text-color);
    }

    /* Ripple */

    :host::before {
      content: '';
      position: absolute;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      pointer-events: none;
      background-color: var(--material-primary-color);
      opacity: 0;
      transform: translate(-50%, -50%) scale(0);
      transition:
        transform 0s cubic-bezier(0.075, 0.82, 0.165, 1),
        opacity 0.4s linear;
      transition-delay: 0.4s, 0s;
    }

    :host([dragover-valid])::before {
      transform: translate(-50%, -50%) scale(10);
      opacity: 0.1;
      transition-duration: 2s, 0.1s;
      transition-delay: 0s, 0s;
    }
  `,
  { moduleId: 'material-upload' },
);

registerStyles(
  'vaadin-upload-icon',
  css`
    :host {
      margin-right: 8px;
    }

    :host::before {
      content: var(--material-icons-upload);
      font-family: material-icons;
      font-size: var(--material-icon-font-size);
      line-height: 1;
    }
  `,
  { moduleId: 'material-upload-icon' },
);

registerStyles(
  'vaadin-upload-file',
  css`
    :host {
      outline: none;
    }

    [part='row'] {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 8px;
    }

    :host([focus-ring]) [part='row'] {
      background-color: var(--material-divider-color);
    }

    [part='status'],
    [part='error'] {
      color: var(--material-secondary-text-color);
      font-size: var(--material-caption-font-size);
    }

    [part='info'] {
      display: flex;
      align-items: baseline;
      flex: auto;
    }

    [part='meta'] {
      width: 0.001px;
      flex: 1 1 auto;
    }

    [part='name'] {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: var(--material-small-font-size);
    }

    [part='commands'] {
      display: flex;
      flex: none;
    }

    [part$='icon'] {
      padding: 8px;
      margin: -8px 0 -8px -8px;
      font-family: material-icons;
      font-size: var(--material-icon-font-size);
      line-height: 1;
    }

    /* When both icons are hidden, let us keep space for one */
    [part='done-icon'][hidden] + [part='warning-icon'][hidden] {
      display: block !important;
      visibility: hidden;
    }

    [part$='button'] {
      position: relative;
      width: 40px;
      height: 40px;
      flex: none;
      font-family: material-icons;
      font-size: var(--material-icon-font-size);
      color: var(--material-secondary-text-color);
      line-height: 1;
      padding: 8px;
      margin: -8px 0;
      outline: none;
    }

    [part='remove-button'] {
      margin-right: -8px;
    }

    [part$='button']:hover {
      color: inherit;
    }

    [part$='button'][disabled] {
      color: var(--material-disabled-text-color);
    }

    [part='done-icon']::before {
      content: var(--material-icons-check);
      color: var(--material-primary-text-color);
    }

    [part='warning-icon']::before {
      content: var(--material-icons-error);
      color: var(--material-error-text-color);
    }

    [part='start-button']::before {
      content: var(--material-icons-play);
    }

    [part='retry-button']::before {
      content: var(--material-icons-reload);
    }

    [part='remove-button']::before {
      content: var(--material-icons-clear);
    }

    [part$='button']:not([disabled])::after {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--material-body-text-color);
      transform: scale(0);
      opacity: 0;
      transition:
        transform 0.08s,
        opacity 0.01s;
      will-change: transform, opacity;
    }

    [part$='button']:hover::after {
      opacity: 0.08;
    }

    [part$='button']:focus::after {
      opacity: 0.12;
    }

    [part$='button']:active::after {
      opacity: 0.16;
    }

    [part$='button']:focus::after,
    [part$='button']:active::after {
      transform: scale(1.2);
    }

    [part='error'] {
      color: var(--material-error-text-color);
    }

    ::slotted([slot='progress']) {
      width: auto;
      margin-left: 28px;
    }
  `,
  { moduleId: 'material-upload-file' },
);
