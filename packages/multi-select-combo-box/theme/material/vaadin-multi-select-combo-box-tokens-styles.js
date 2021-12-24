/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { fieldButton } from '@vaadin/vaadin-material-styles/mixins/field-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const token = css`
  :host {
    display: flex;
    align-items: center;
    padding-left: 0.5rem;
    margin: 0.25rem;
    border-radius: 1.25rem;
    background-color: hsla(214, 53%, 23%, 0.1);
    cursor: default;
    white-space: nowrap;
    height: 26px;
    box-sizing: border-box;
    font-family: var(--material-font-family);
  }

  [part='label'] {
    display: flex;
    align-items: center;
    font-size: var(--material-small-font-size);
  }

  /* Override field button */
  [part='remove-button'] {
    flex: none;
    width: 20px;
    height: 20px;
    padding: unset;
    padding-left: 4px;
    color: hsla(0, 0%, 100%, 0.9);
    font-size: inherit;
    line-height: 20px;
    text-align: unset;
  }

  [part='remove-button']::before {
    content: var(--material-icons-clear);
    border-radius: 50%;
    background-color: hsla(214, 45%, 20%, 0.5);
  }

  :host(:not([disabled])) [part='remove-button']:hover {
    color: hsla(0, 0%, 100%, 0.9);
  }

  [part='remove-button']:hover::before {
    background-color: hsla(214, 41%, 17%, 0.83);
  }

  /* Disabled */
  :host([disabled]) [part='label'],
  :host([disabled]) [part='remove-button'] {
    pointer-events: none;
  }

  :host([disabled]) [part='label'] {
    color: var(--material-disabled-text-color);
    -webkit-text-fill-color: var(--material-disabled-text-color);
  }

  :host([disabled]) [part='remove-button'] {
    color: hsla(0, 0%, 100%, 0.75);
    -webkit-text-fill-color: hsla(0, 0%, 100%, 0.75);
  }
`;

registerStyles('vaadin-multi-select-combo-box-token', [fieldButton, token], {
  moduleId: 'material-multi-select-combo-box-token'
});

registerStyles(
  'vaadin-multi-select-combo-box-tokens',
  css`
    [part='compact-mode-label'] {
      display: flex;
      flex-grow: 1;
      align-items: center;
      margin: 0.5rem;
      color: var(--material-body-text-color);
      font-family: var(--material-font-family);
      font-size: var(--material-body-font-size);
      cursor: default;
    }

    [part='tokens'] {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
      width: 100%;
      min-width: 0;
    }

    :host([disabled]) [part='compact-mode-label'] {
      color: var(--material-disabled-text-color);
      -webkit-text-fill-color: var(--material-disabled-text-color);
      pointer-events: none;
    }
  `,
  {
    moduleId: 'material-multi-select-combo-box-tokens'
  }
);
