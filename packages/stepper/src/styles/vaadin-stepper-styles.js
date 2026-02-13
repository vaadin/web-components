/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const stepperStyles = css`
  :host {
    display: block;
    font-family: var(--lumo-font-family);
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='nav'] {
    display: block;
  }

  [part='list'] {
    display: flex;
    flex-direction: column;
    gap: var(--lumo-space-l);
    list-style: none;
    margin: 0;
    padding: 0;
    counter-reset: step;
  }

  /* Horizontal orientation */
  :host([orientation='horizontal']) [part='list'] {
    flex-direction: row;
    align-items: center;
  }

  /* Small theme */
  :host([theme~='small']) [part='list'] {
    gap: var(--lumo-space-m);
  }

  /* Counter for step numbers */
  ::slotted(vaadin-step) {
    counter-increment: step;
  }

  /* Responsive behavior */
  @media (max-width: 1023px) {
    :host([orientation='horizontal']) [part='list'] {
      flex-direction: column;
      align-items: stretch;
    }
  }

  /* RTL support */
  :host([dir='rtl']) [part='list'] {
    direction: rtl;
  }
`;
