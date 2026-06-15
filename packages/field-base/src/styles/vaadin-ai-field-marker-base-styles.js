/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

/**
 * Styles applied to the `<vaadin-ai-field-marker>` element itself: the badge
 * button anchored to the field's top corner and the popover content.
 */
export const aiFieldMarkerStyles = css`
  :host {
    position: absolute;
    inset: 0;
    /* Let pointer events through to the field; interactive parts re-enable them. */
    pointer-events: none;
  }

  [part='badge'] {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    transform: translateY(-50%);
    pointer-events: auto;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    height: 1.25rem;
    padding: 0 0.375rem;
    border: none;
    border-radius: 0.625rem;
    margin: 0;
    background: var(--vaadin-ai-marker-badge-background, linear-gradient(135deg, #7c3aed, #a855f7));
    color: var(--vaadin-ai-marker-badge-color, #fff);
    font: inherit;
    font-size: 0.625rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.05em;
    cursor: pointer;
  }

  [part='badge']:focus-visible {
    outline: 2px solid var(--vaadin-ai-marker-accent-color, #7c3aed);
    outline-offset: 2px;
  }

  [part='content'] {
    pointer-events: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 20rem;
    padding: 0.5rem;
  }

  [part='message'] {
    margin: 0;
  }

  [part='actions'] {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  [part='revert-button'] {
    pointer-events: auto;
    box-sizing: border-box;
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--vaadin-ai-marker-accent-color, #7c3aed);
    border-radius: 0.25rem;
    background: transparent;
    color: var(--vaadin-ai-marker-accent-color, #7c3aed);
    font: inherit;
    cursor: pointer;
  }

  [part='revert-button']:focus-visible {
    outline: 2px solid var(--vaadin-ai-marker-accent-color, #7c3aed);
    outline-offset: 2px;
  }
`;

/**
 * Styles injected into the highlighted field's own shadow root so the whole
 * field (label, input, helper) gets a tinted, rounded "AI-filled" panel that
 * sits behind the field content. Scoped to the `has-ai-marker` state attribute
 * that `AiFieldMarker.mark()` sets on the field.
 */
export const aiFieldMarkerHostStyles = css`
  :host([has-ai-marker]) {
    border-radius: var(--vaadin-ai-marker-border-radius, 0.5rem);
    background-color: var(--vaadin-ai-marker-background-color, rgba(124, 58, 237, 0.08));
    box-shadow: 0 0 0 var(--vaadin-ai-marker-padding, 0.5rem)
      var(--vaadin-ai-marker-background-color, rgba(124, 58, 237, 0.08));
  }
`;
