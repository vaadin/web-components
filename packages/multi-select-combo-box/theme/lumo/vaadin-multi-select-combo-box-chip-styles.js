/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { fieldButton } from '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const chip = css`
  :host {
    display: inline-flex;
    align-items: center;
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-xxs);
    line-height: 1;
    padding: 0.4em calc(0.5em + var(--lumo-border-radius-s) / 4);
    border-radius: var(--lumo-border-radius-s);
    background-color: var(--lumo-contrast-20pct);
    cursor: var(--lumo-clickable-cursor);
    white-space: nowrap;
    box-sizing: border-box;
    min-width: 0;
  }

  [part='label'] {
    color: var(--lumo-body-text-color);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  [part='remove-button'] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    min-width: var(--lumo-icon-size-s);
    font-size: inherit;
  }
  [part='remove-button']::before {
    content: var(--lumo-icons-cross);
  }

  :host([disabled]) [part] {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
    pointer-events: none;
  }
`;

registerStyles('vaadin-multi-select-combo-box-chip', [fieldButton, chip], {
  moduleId: 'lumo-multi-select-combo-box-chip'
});
