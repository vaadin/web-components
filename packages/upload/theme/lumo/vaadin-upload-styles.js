import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/button/theme/lumo/vaadin-button-styles.js';
import '@vaadin/progress-bar/theme/lumo/vaadin-progress-bar-styles.js';
import { fieldButton } from '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-upload',
  css`
    :host {
      line-height: var(--lumo-line-height-m);
    }

    :host(:not([nodrop])) {
      padding: var(--lumo-space-m);
      overflow: hidden;
      transition:
        background-color 0.6s,
        border-color 0.6s;
      border: 1px dashed var(--lumo-contrast-20pct);
      border-radius: var(--lumo-border-radius-l);
    }

    [part='drop-label'] {
      display: inline-block;
      padding: 0 var(--lumo-space-s);
      color: var(--lumo-secondary-text-color);
      font-family: var(--lumo-font-family);
      white-space: normal;
    }

    :host([dragover-valid]) {
      transition:
        background-color 0.1s,
        border-color 0.1s;
      border-color: var(--lumo-primary-color-50pct);
      background: var(--lumo-primary-color-10pct);
    }

    :host([dragover-valid]) [part='drop-label'] {
      color: var(--lumo-primary-text-color);
    }

    :host([disabled]) [part='drop-label'],
    :host([max-files-reached]) [part='drop-label'] {
      color: var(--lumo-disabled-text-color);
    }
  `,
  { moduleId: 'lumo-upload' },
);

registerStyles(
  'vaadin-upload-icon',
  css`
    :host::before {
      content: var(--lumo-icons-upload);
      font-family: lumo-icons;
      font-size: var(--lumo-icon-size-m);
      line-height: 1;
      vertical-align: -0.25em;
    }
  `,
  { moduleId: 'lumo-upload-icon' },
);

registerStyles(
  'vaadin-upload-file-list',
  css`
    ::slotted(li:not(:first-of-type)) {
      border-top: 1px solid var(--lumo-contrast-10pct);
    }
  `,
  { moduleId: 'lumo-upload-file-list' },
);

const uploadFile = css`
  :host {
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    padding: var(--lumo-space-s) 0;
    outline: none;
  }

  :host([focus-ring]) [part='row'] {
    border-radius: var(--lumo-border-radius-s);
    box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
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
    flex: auto;
    align-items: baseline;
  }

  [part='meta'] {
    flex: 1 1 auto;
    width: 0.001px;
  }

  [part='name'] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [part='commands'] {
    display: flex;
    flex: none;
    align-items: baseline;
  }

  [part$='icon'] {
    margin-right: var(--lumo-space-xs);
    font-family: 'lumo-icons';
    font-size: var(--lumo-icon-size-m);
    line-height: 1;
  }

  /* When both icons are hidden, let us keep space for one */
  [part='done-icon'][hidden] + [part='warning-icon'][hidden] {
    display: block !important;
    visibility: hidden;
  }

  [part$='button'] {
    flex: none;
    margin-left: var(--lumo-space-xs);
    cursor: var(--lumo-clickable-cursor);
  }

  [part$='button']:focus {
    border-radius: var(--lumo-border-radius-s);
    outline: none;
    box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
  }

  [part$='icon']::before,
  [part$='button']::before {
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

  [part='remove-button']::before {
    content: var(--lumo-icons-cross);
  }

  [part='error'] {
    color: var(--lumo-error-text-color);
  }

  ::slotted([slot='progress']) {
    width: auto;
    margin-right: calc(var(--lumo-icon-size-m) + var(--lumo-space-xs));
    margin-left: calc(var(--lumo-icon-size-m) + var(--lumo-space-xs));
  }
`;

registerStyles('vaadin-upload-file', [fieldButton, uploadFile], { moduleId: 'lumo-upload-file' });
