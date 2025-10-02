/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const gridSorterStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    max-width: 100%;
    gap: var(--vaadin-gap-s);
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  [part='content'] {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  [part='indicators'] {
    position: relative;
    flex: none;
    height: 1lh;
    color: var(--vaadin-text-color-disabled);
  }

  [part='order'] {
    display: inline;
    vertical-align: super;
    font-size: 0.75em;
    line-height: 1;
    color: var(--vaadin-text-color-secondary);
  }

  [part='indicators']::before {
    content: '';
    display: inline-block;
    height: 12px;
    width: 8px;
    mask-image: var(--_vaadin-icon-sort);
    background: currentColor;
  }

  :host([direction]) [part='indicators']::before {
    padding-bottom: 6px;
    height: 6px;
    mask-clip: content-box;
  }

  :host([direction='desc']) [part='indicators']::before {
    padding-block: 6px 0;
  }

  :host([direction]) [part='indicators'] {
    color: var(--vaadin-text-color-secondary);
  }

  @media (any-hover: hover) {
    :host(:hover) [part='indicators'] {
      color: var(--vaadin-text-color);
    }
  }

  @media (forced-colors: active) {
    [part='indicators']::before {
      background: CanvasText;
    }
  }
`;
