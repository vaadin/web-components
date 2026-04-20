/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { loaderStyles } from '@vaadin/component-base/src/styles/loader-styles.js';

export const uploadFileStyles = [
  loaderStyles,
  css`
    :host {
      align-items: baseline;
      display: grid;
      gap: var(--vaadin-upload-file-gap, var(--vaadin-gap-s));
      grid-template-columns: var(--vaadin-icon-size, 1lh) minmax(0, 1fr) auto;
      padding: var(--vaadin-upload-file-padding, var(--vaadin-padding-s));
      border-radius: var(--vaadin-upload-file-border-radius, var(--vaadin-radius-m));
    }

    :host(:focus-visible) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
    }

    [hidden] {
      display: none;
    }

    [part='thumbnail'],
    [part='loader'] {
      display: none;
      grid-column: 1;
    }

    [part='done-icon']:not([hidden]),
    [part='warning-icon']:not([hidden]) {
      display: flex;
      grid-column: 1;
    }

    [part='loader']::before,
    [part='done-icon']::before,
    [part='warning-icon']::before {
      content: '\\2003' / '';
      display: inline-flex;
      align-items: center;
      flex: none;
      height: var(--vaadin-icon-size, 1lh);
      width: var(--vaadin-icon-size, 1lh);
    }

    [part='loader']::before {
      margin: calc(var(--vaadin-spinner-width, 2px) * -1);
    }

    :is([part$='icon'], [part$='button'])::before {
      mask-size: var(--vaadin-icon-visual-size, 100%);
      mask-position: 50%;
      mask-repeat: no-repeat;
    }

    [part='done-icon']::before {
      background: var(--vaadin-upload-file-done-color, currentColor);
      mask-image: var(--_vaadin-icon-checkmark);
    }

    [part='warning-icon']::before {
      background: var(--vaadin-upload-file-warning-color, currentColor);
      mask-image: var(--_vaadin-icon-warn);
    }

    [part='meta'] {
      grid-column: 2;

      & > div {
        cursor: inherit;
      }
    }

    [part='name'] {
      color: var(--vaadin-upload-file-name-color, var(--vaadin-text-color));
      font-size: var(--vaadin-upload-file-name-font-size, inherit);
      font-weight: var(--vaadin-upload-file-name-font-weight, inherit);
      line-height: var(--vaadin-upload-file-name-line-height, inherit);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [part='status'] {
      color: var(--vaadin-upload-file-status-color, var(--vaadin-text-color-secondary));
      font-size: var(--vaadin-upload-file-status-font-size, inherit);
      font-weight: var(--vaadin-upload-file-status-font-weight, inherit);
      line-height: var(--vaadin-upload-file-status-line-height, inherit);
    }

    [part='error'] {
      color: var(--vaadin-upload-file-error-color, var(--vaadin-text-color));
      font-size: var(--vaadin-upload-file-error-font-size, inherit);
      font-weight: var(--vaadin-upload-file-error-font-weight, inherit);
      line-height: var(--vaadin-upload-file-error-line-height, inherit);
    }

    [part='commands'] {
      display: flex;
      align-items: center;
      gap: var(--vaadin-gap-xs);
      height: var(--vaadin-icon-size, 1lh);
      align-self: center;
    }

    button {
      background: var(--vaadin-upload-file-button-background, transparent);
      border: var(--vaadin-upload-file-button-border-width, 0) solid
        var(--vaadin-upload-file-button-border-color, var(--vaadin-border-color-secondary));
      border-radius: var(--vaadin-upload-file-button-border-radius, var(--vaadin-radius-m));
      color: var(--vaadin-upload-file-button-text-color, var(--vaadin-text-color));
      cursor: var(--vaadin-clickable-cursor);
      flex-shrink: 0;
      font: inherit;
      /* Ensure minimum click target (WCAG) */
      padding: var(--vaadin-upload-file-button-padding, max(0px, (24px - var(--vaadin-icon-size, 1lh)) / 2));
    }

    button:focus-visible {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    }

    [part='start-button']::before,
    [part='retry-button']::before,
    [part='remove-button']::before {
      background: currentColor;
      content: '\\2003' / '';
      display: flex;
      align-items: center;
      height: var(--vaadin-icon-size, 1lh);
      width: var(--vaadin-icon-size, 1lh);
    }

    [part='start-button']::before {
      mask-image: var(--_vaadin-icon-play);
    }

    [part='retry-button']::before {
      mask-image: var(--_vaadin-icon-refresh);
    }

    [part='remove-button']::before {
      mask-image: var(--_vaadin-icon-cross);
    }

    ::slotted([slot='progress']) {
      grid-column: 2 / -1;
      width: auto;
    }

    :host([complete]) ::slotted([slot='progress']),
    :host([error]) ::slotted([slot='progress']) {
      display: none;
    }

    /* THUMBNAILS VARIANT */

    :host([theme~='thumbnails']) {
      grid-template-columns: max-content 1fr max-content;
      align-items: center;
      background: var(--vaadin-background-container);
      padding: 0;
      contain: content;

      & [part] {
        grid-row: 1;
      }

      & [part='thumbnail'],
      & [part$='icon'] {
        grid-column: 1;
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s opacity linear;
        background: var(--vaadin-background-container-strong);
        padding: var(--vaadin-upload-file-padding, var(--vaadin-padding-s));
        contain: content;

        &[hidden] {
          opacity: 0;
        }
      }

      & [part='thumbnail'] > img {
        object-fit: cover;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      & [part='loader']:not([hidden]) {
        place-self: center;
        display: flex;
      }

      & [part='done-icon']::before {
        background: var(--vaadin-upload-file-done-color, currentColor);
        mask-image: var(--_vaadin-icon-file);
      }

      & [part='meta'] {
        padding: var(--vaadin-upload-file-padding, var(--vaadin-padding-s));
        padding-inline: 0;
      }

      & [part='name'] {
        word-break: break-all;
      }

      & [part='commands'] {
        padding: var(--vaadin-upload-padding, var(--vaadin-padding-s));
        padding-inline-start: 0;
      }

      & [part='status'] {
        clip-path: inset(50%);
        width: 1px;
        height: 1px;
        margin: 0;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
      }

      & [part='error'] {
        font-size: 0.875em;
        line-height: 1.25;
      }

      & ::slotted([slot='progress']) {
        grid-row: auto;
        grid-column: auto;
        position: absolute;
        inset: 0;
        opacity: 0.3;
        pointer-events: none;
        --vaadin-progress-bar-height: auto;
        --vaadin-progress-bar-border-width: 0px;
        --vaadin-progress-bar-border-radius: 0px;
        --vaadin-progress-bar-background: transparent;
      }

      & ::slotted([slot='progress'][indeterminate]) {
        opacity: 0;
      }
    }

    :host([theme~='thumbnails']:not([complete])) [part='thumbnail'],
    :host([theme~='thumbnails'][complete]) [part='thumbnail']:not([hidden]) + [part='done-icon'] {
      display: none;
    }

    /* TODO: queued state styles (no attribute makes this difficult to target) */

    @media (forced-colors: active) {
      :is([part$='icon'], [part$='button'])::before {
        background: CanvasText;
      }
    }
  `,
];
