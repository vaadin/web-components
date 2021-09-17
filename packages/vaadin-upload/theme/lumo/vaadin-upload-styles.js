import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import '@vaadin/vaadin-button/theme/lumo/vaadin-button.js';
import '@vaadin/vaadin-progress-bar/theme/lumo/vaadin-progress-bar.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-upload',
  css`
    :host {
      line-height: var(--lumo-line-height-m);
    }

    :host(:not([nodrop])) {
      overflow: hidden;
      border: 1px dashed var(--lumo-contrast-20pct);
      border-radius: var(--lumo-border-radius-s);
      padding: var(--lumo-space-m);
      transition: background-color 0.6s, border-color 0.6s;
    }

    [part='primary-buttons'] > * {
      display: inline-block;
      white-space: nowrap;
    }

    [part='drop-label'] {
      display: inline-block;
      white-space: normal;
      padding: 0 var(--lumo-space-s);
      color: var(--lumo-secondary-text-color);
      font-family: var(--lumo-font-family);
    }

    :host([dragover-valid]) {
      border-color: var(--lumo-primary-color-50pct);
      background: var(--lumo-primary-color-10pct);
      transition: background-color 0.1s, border-color 0.1s;
    }

    :host([dragover-valid]) [part='drop-label'] {
      color: var(--lumo-primary-text-color);
    }

    :host([max-files-reached]) [part='drop-label'] {
      color: var(--lumo-disabled-text-color);
    }

    [part='drop-label-icon'] {
      display: inline-block;
    }

    [part='drop-label-icon']::before {
      content: var(--lumo-icons-upload);
      font-family: lumo-icons;
      font-size: var(--lumo-icon-size-m);
      line-height: 1;
      vertical-align: -0.25em;
    }
  `,
  { moduleId: 'lumo-upload' }
);

registerStyles(
  'vaadin-upload-file',
  css`
    :host {
      padding: var(--lumo-space-s) 0;
    }

    :host(:not(:first-child)) {
      border-top: 1px solid var(--lumo-contrast-10pct);
    }

    [part='row'] {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    [part='status'],
    [part='error'] {
      color: var(--lumo-secondary-text-color);
      font-size: var(--lumo-font-size-s);
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
    }

    [part='commands'] {
      display: flex;
      align-items: baseline;
      flex: none;
    }

    [part='done-icon'],
    [part='warning-icon'] {
      margin-right: var(--lumo-space-xs);
    }

    /* When both icons are hidden, let us keep space for one */
    [part='done-icon'][hidden] + [part='warning-icon'][hidden] {
      display: block !important;
      visibility: hidden;
    }

    [part='done-icon'],
    [part='warning-icon'] {
      font-size: var(--lumo-icon-size-m);
      font-family: 'lumo-icons';
      line-height: 1;
    }

    [part='start-button'],
    [part='retry-button'],
    [part='clear-button'] {
      flex: none;
      margin-left: var(--lumo-space-xs);
      cursor: var(--lumo-clickable-cursor);
    }

    [part='done-icon']::before,
    [part='warning-icon']::before,
    [part='start-button']::before,
    [part='retry-button']::before,
    [part='clear-button']::before {
      vertical-align: -0.25em;
    }

    [part='done-icon']::before {
      content: var(--lumo-icons-checkmark);
      color: var(--lumo-primary-text-color);
    }

    [part='warning-icon']::before {
      content: var(--lumo-icons-error);
      color: var(--lumo-error-text-color);
    }

    [part='start-button']::before {
      content: var(--lumo-icons-play);
    }

    [part='retry-button']::before {
      content: var(--lumo-icons-reload);
    }

    [part='clear-button']::before {
      content: var(--lumo-icons-cross);
    }

    [part='error'] {
      color: var(--lumo-error-text-color);
    }

    [part='progress'] {
      width: auto;
      margin-left: calc(var(--lumo-icon-size-m) + var(--lumo-space-xs));
      margin-right: calc(var(--lumo-icon-size-m) + var(--lumo-space-xs));
    }

    [part='progress'][complete],
    [part='progress'][error] {
      display: none;
    }
  `,
  { include: ['lumo-field-button'], moduleId: 'lumo-upload-file' }
);
