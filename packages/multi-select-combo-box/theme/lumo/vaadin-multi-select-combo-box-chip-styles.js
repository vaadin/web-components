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
    display: flex;
    align-items: center;
    margin: var(--lumo-space-xs) 0 0;
    padding-inline-start: var(--lumo-space-s);
    border-radius: var(--lumo-border-radius);
    background-color: var(--lumo-contrast-20pct);
    cursor: var(--lumo-clickable-cursor);
    white-space: nowrap;
    height: calc(var(--lumo-size-m) - 2 * var(--lumo-space-xs));
    box-sizing: border-box;
    min-width: 0;
    font-family: var(--lumo-font-family);
  }

  [part='label'] {
    font-size: var(--lumo-font-size-s);
    line-height: var(--lumo-line-height-m);
    color: var(--lumo-body-text-color);
    font-weight: 500;
    overflow: hidden;
  }

  [part='remove-button'] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
    min-width: var(--lumo-icon-size-m);
    font-size: var(--lumo-icon-size-s);
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
