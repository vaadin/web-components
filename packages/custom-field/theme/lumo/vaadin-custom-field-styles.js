/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/mixins/required-field.js';

registerStyles(
  'vaadin-custom-field',
  css`
    :host {
      --lumo-text-field-size: var(--lumo-size-m);
      color: var(--lumo-body-text-color);
      font-size: var(--lumo-font-size-m);
      /* align with text-field height + vertical paddings */
      line-height: calc(var(--lumo-text-field-size) + 2 * var(--lumo-space-xs));
      font-family: var(--lumo-font-family);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
      padding: 0;
    }

    :host::before {
      margin-top: var(--lumo-space-xs);
      height: var(--lumo-text-field-size);
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
    }

    /* align with text-field label */
    :host([has-label]) [part='label'] {
      padding-bottom: calc(0.5em - var(--lumo-space-xs));
    }

    :host(:not([has-label])) [part='label'],
    :host(:not([has-label]))::before {
      display: none;
    }

    /* align with text-field error message */
    :host([invalid]) [part='error-message']:not(:empty)::before {
      height: calc(0.4em - var(--lumo-space-xs));
    }

    :host([focused]:not([readonly]):not([disabled])) [part='label'] {
      color: var(--lumo-primary-text-color);
    }

    :host(:hover:not([readonly]):not([disabled]):not([focused])) [part='label'],
    :host(:hover:not([readonly]):not([disabled]):not([focused])) [part='helper-text'] {
      color: var(--lumo-body-text-color);
    }

    :host([has-helper]) [part='helper-text']::before {
      content: '';
      display: block;
      height: 0.4em;
    }

    [part='helper-text'] {
      display: block;
      color: var(--lumo-secondary-text-color);
      font-size: var(--lumo-font-size-xs);
      line-height: var(--lumo-line-height-xs);
      margin-left: calc(var(--lumo-border-radius-m) / 4);
      transition: color 0.2s;
    }

    /* Helper text position */
    :host([has-helper][theme~='helper-above-field']) [part='helper-text']::before {
      display: none;
    }

    :host([has-helper][theme~='helper-above-field']) [part='helper-text']::after {
      content: '';
      display: block;
      height: 0.4em;
    }

    :host([has-helper][theme~='helper-above-field']) [part='label'] {
      order: 0;
      padding-bottom: 0.4em;
    }

    :host([has-helper][theme~='helper-above-field']) [part='helper-text'] {
      order: 1;
    }

    :host([has-helper][theme~='helper-above-field']) .inputs-wrapper {
      order: 2;
    }

    :host([has-helper][theme~='helper-above-field']) [part='error-message'] {
      order: 3;
    }

    /* Touch device adjustment */
    @media (pointer: coarse) {
      :host(:hover:not([readonly]):not([disabled]):not([focused])) [part='label'] {
        color: var(--lumo-secondary-text-color);
      }
    }

    /* Disabled */
    :host([disabled]) [part='label'] {
      color: var(--lumo-disabled-text-color);
      -webkit-text-fill-color: var(--lumo-disabled-text-color);
    }

    /* Small theme */
    :host([theme~='small']) {
      font-size: var(--lumo-font-size-s);
      --lumo-text-field-size: var(--lumo-size-s);
    }

    :host([theme~='small'][has-label]) [part='label'] {
      font-size: var(--lumo-font-size-xs);
    }

    :host([theme~='small'][has-label]) [part='error-message'] {
      font-size: var(--lumo-font-size-xxs);
    }
  `,
  { moduleId: 'lumo-custom-field', include: ['lumo-required-field'] }
);
