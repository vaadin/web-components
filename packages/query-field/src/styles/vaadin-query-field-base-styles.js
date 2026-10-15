/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const queryFieldStyles = css`
  [part='input-field'] {
    position: relative;
  }

  /* The native input renders a transparent value on top of the highlights */
  ::slotted(input:not(:placeholder-shown)) {
    position: relative;
    color: transparent;
    caret-color: var(--vaadin-input-field-value-color, var(--vaadin-text-color));
  }

  [part='highlights'] {
    position: absolute;
    display: flex;
    align-items: center;
    overflow: hidden;
    pointer-events: none;
    white-space: pre;
    text-align: inherit;
  }

  #highlightsContent {
    flex: none;
  }

  [part~='token'] {
    border-radius: var(--vaadin-query-field-token-border-radius, var(--vaadin-radius-s));
    background: var(
      --vaadin-query-field-token-background,
      color-mix(in srgb, var(--vaadin-text-color) 8%, transparent)
    );
    box-shadow: 0 0 0 1px
      var(--vaadin-query-field-token-background, color-mix(in srgb, var(--vaadin-text-color) 8%, transparent));
  }

  [part~='token-name'] {
    color: var(--vaadin-query-field-token-name-color, var(--vaadin-text-color-secondary));
  }

  [part~='token-value'] {
    color: var(--vaadin-query-field-token-value-color, inherit);
  }

  [part~='invalid-token'] {
    text-decoration: underline wavy
      var(--vaadin-query-field-invalid-token-color, var(--vaadin-input-field-error-color, red));
    text-decoration-skip-ink: none;
  }

  @media (forced-colors: active) {
    [part~='token'] {
      background: Mark;
      color: MarkText;
    }

    [part~='token-name'],
    [part~='token-value'] {
      color: inherit;
    }
  }
`;
