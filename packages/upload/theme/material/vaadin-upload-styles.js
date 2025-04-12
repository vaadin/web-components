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
      border: 1px dashed var(--material-divider-color);
      border-radius: 4px;
      overflow: hidden;
      padding: 8px 16px;
      position: relative;
      transition: border-color 0.6s;
    }

    [part='primary-buttons'] {
      align-items: baseline;
      display: inline-flex;
      flex-wrap: wrap;
    }

    ::slotted([slot='add-button']) {
      margin: 0 -8px;
    }

    [part='drop-label'] {
      color: var(--material-secondary-text-color);
      font-family: var(--material-font-family);
      font-size: var(--material-small-font-size);
      padding: 0 24px;
      text-align: center;
      white-space: normal;
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
      background-color: var(--material-primary-color);
      border-radius: 50%;
      content: '';
      height: 100px;
      left: 50%;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      transition:
        transform 0s cubic-bezier(0.075, 0.82, 0.165, 1),
        opacity 0.4s linear;
      transition-delay: 0.4s, 0s;
      width: 100px;
    }

    :host([dragover-valid])::before {
      opacity: 0.1;
      transform: translate(-50%, -50%) scale(10);
      transition-delay: 0s, 0s;
      transition-duration: 2s, 0.1s;
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
      align-items: flex-start;
      display: flex;
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
      align-items: baseline;
      display: flex;
      flex: auto;
    }

    [part='meta'] {
      flex: 1 1 auto;
      width: 0.001px;
    }

    [part='name'] {
      font-size: var(--material-small-font-size);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    [part='commands'] {
      display: flex;
      flex: none;
    }

    [part$='icon'] {
      font-family: material-icons;
      font-size: var(--material-icon-font-size);
      line-height: 1;
      margin: -8px 0 -8px -8px;
      padding: 8px;
    }

    /* When both icons are hidden, let us keep space for one */
    [part='done-icon'][hidden] + [part='warning-icon'][hidden] {
      display: block !important;
      visibility: hidden;
    }

    [part$='button'] {
      color: var(--material-secondary-text-color);
      flex: none;
      font-family: material-icons;
      font-size: var(--material-icon-font-size);
      height: 40px;
      line-height: 1;
      margin: -8px 0;
      outline: none;
      padding: 8px;
      position: relative;
      width: 40px;
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
      color: var(--material-primary-text-color);
      content: var(--material-icons-check);
    }

    [part='warning-icon']::before {
      color: var(--material-error-text-color);
      content: var(--material-icons-error);
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
      background-color: var(--material-body-text-color);
      border-radius: 50%;
      content: '';
      height: 40px;
      left: 0;
      opacity: 0;
      position: absolute;
      top: 0;
      transform: scale(0);
      transition:
        transform 0.08s,
        opacity 0.01s;
      width: 40px;
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
      margin-left: 28px;
      width: auto;
    }
  `,
  { moduleId: 'material-upload-file' },
);
