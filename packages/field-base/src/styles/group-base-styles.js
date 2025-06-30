/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css, unsafeCSS } from 'lit';

export const group = (name = 'checkbox') => css`
  @layer base {
    :host {
      width: fit-content;
    }

    .vaadin-group-field-container {
      display: contents;
    }

    :host,
    [part='group-field'] {
      display: flex;
      flex-direction: column;
      gap: var(--vaadin-${unsafeCSS(name)}-group-gap, var(--vaadin-gap-container-block));
    }

    [part='group-field'] {
      gap: 0.5lh 1.5em;
    }

    :host([theme~='horizontal']) [part='group-field'] {
      flex-flow: row wrap;
    }
  }
`;
