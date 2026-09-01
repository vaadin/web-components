/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const group = css`
  [part='label'],
  [part='helper-text'],
  [part='error-message'] {
    width: auto;
    min-width: auto;
  }

  [part='group-field'] {
    display: flex;
    flex-direction: column;
    gap: var(--vaadin-gap-xs) var(--vaadin-gap-xl);
  }

  :host([theme~='horizontal']) [part='group-field'] {
    flex-flow: row wrap;
    align-items: center;
  }

  :host([has-label][theme~='horizontal']) [part='group-field'] {
    padding: var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container);
    padding-inline: 0;
    border-block: var(--vaadin-input-field-border-width, 1px) solid transparent;
  }

  /*
   * The baseline guide of a group should not account for the input's
   * padding and border, which checkables don't have, so that the group
   * label aligns with the labels of other fields on the same row when
   * labels are displayed aside.
   */
  :host([theme~='label-aside']) {
    --vaadin-field-baseline-input-height: calc(
      1lh + var(--vaadin-padding-block-container) + var(--vaadin-input-field-border-width, 1px)
    );
  }
`;
