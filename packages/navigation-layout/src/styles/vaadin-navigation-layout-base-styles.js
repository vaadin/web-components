/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const navigationLayoutStyles = css`
  :host {
    --vaadin-navigation-layout-collapsed: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-width: 0;
    min-height: 0;
    height: 100%;
    flex: 1;
    overflow: clip;
    white-space: nowrap;
  }

  :host([slot^='navbar']) {
    flex-direction: row;
    align-items: center;
    margin: calc(var(--vaadin-padding-s) * -1);
    --vaadin-navigation-layout-direction: row;
    --vaadin-navigation-layout-toggle-display: none;

    [part='end'] {
      --vaadin-navigation-layout-collapsed: 1;
    }

    [part='content'] {
      scrollbar-width: none;
    }
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([collapsed]) {
    --vaadin-navigation-layout-collapsed: 1;
  }

  [part] {
    @container style(--vaadin-navigation-layout-collapsed: 0) {
      slot {
        --vaadin-tooltip-display: none;
      }
    }
  }

  [part='start'],
  [part='end'] {
    flex: none;
    display: none;
    flex-direction: inherit;
    align-items: inherit;
    padding: var(--vaadin-padding-s);
    gap: var(--vaadin-gap-xs);
  }

  [part='content'] {
    flex: 1;
    min-height: 0;
    min-width: 0;
    --vaadin-scroller-padding-inline: var(--vaadin-padding-s);
    --vaadin-scroller-padding-block: var(--vaadin-padding-s);
  }

  :host(:has(> [slot='start'])) {
    [part='start'] {
      display: flex;
    }

    [part='content'] {
      --vaadin-scroller-overflow-indicator-top-opacity: 1;
    }
  }

  :host(:has(> [slot='end'])) {
    /* TODO shouldn't show in drawer overlay if it only contains the navigation-layout-toggle */
    [part='end'] {
      display: flex;
    }

    [part='content'] {
      --vaadin-scroller-overflow-indicator-bottom-opacity: 1;
    }
  }

  @scope {
    :scope:has(> [slot='start']) {
      [part='start'] {
        display: flex;
      }

      [part='content'] {
        --vaadin-scroller-overflow-indicator-top-opacity: 1;
      }
    }

    :scope:has(> [slot='end']) {
      [part='end'] {
        display: flex;
      }

      [part='content'] {
        --vaadin-scroller-overflow-indicator-bottom-opacity: 1;
      }
    }
  }

  slot:is([name='start'], [name='end'])::slotted(vaadin-button) {
    justify-content: start;
    text-align: start;
    --vaadin-button-text-color: var(--vaadin-text-color-secondary);
    --vaadin-button-label-flex: auto;
  }

  @media (width < 45rem) {
    :host([slot='navbar']) {
      --vaadin-navigation-layout-collapsed: 1;
    }
  }
`;
