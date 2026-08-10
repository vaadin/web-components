/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { screenReaderOnly } from '@vaadin/a11y-base/src/styles/sr-only-styles.js';

export const aiFieldMarkerHostStyles = css`
  @keyframes --vaadin-ai-field-marker-slide {
    0% {
      --vaadin-ai-field-marker-mask-pos: -100px;
    }

    100% {
      --vaadin-ai-field-marker-mask-pos: calc(100% + 100px);
    }
  }

  @keyframes --vaadin-ai-field-marker-remove-mask {
    100% {
      mask-image: none;
    }
  }

  /* Show the helper text section while it holds the confidence indicator,
     even for a field that has no helper of its own: the indicator is hidden
     from the field's helper slot controller (see the marker source), so the
     field does not set its own has-helper attribute for it. The custom
     properties mirror the field's has-helper toggles, so the label and error
     message keep the spacing they have next to a helper. Not applied while
     the AI is working, when the indicator is hidden along with the marker. */
  :host([ai-confidence]:not([ai-working])) {
    --_has-helper: initial;
    --_no-helper: ;
  }

  :host([ai-confidence]:not([ai-working])) [part='helper-text'] {
    display: block;
  }
`;

/**
 * Styles applied to the `<vaadin-ai-field-marker>` element itself: the badge
 * button anchored to the field's top corner and the popover content.
 */
export const aiFieldMarkerStyles = css`
  :has(> vaadin-ai-field-marker) {
    position: relative;
  }

  /* --vaadin-ai-field-marker-mask-pos is registered from JS: an @property rule only
     takes effect at document scope, and this sheet is injected into the field's
     root node, which is a shadow root for a nested field. */

  vaadin-ai-field-marker[hidden] {
    display: none !important;
  }

  :where(vaadin-ai-field-marker) {
    display: contents;
    --_vaadin-ai-field-marker-color-1: light-dark(#932fffd9, #bc64ff);
    --_vaadin-ai-field-marker-color-2: light-dark(#004cffcc, #539aff);

    &::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 9px;
      z-index: -1;
      pointer-events: none;
      background-color: color-mix(in srgb, var(--_vaadin-ai-field-marker-color-2) 30%, transparent);
      background-image:
        radial-gradient(66.92% 123.25% at 100% 88.78%, var(--_vaadin-ai-field-marker-color-1) 0%, transparent 100%),
        radial-gradient(42.57% 69.91% at 14.85% 33.33%, var(--_vaadin-ai-field-marker-color-2) 0%, transparent 100%);
      opacity: 0.16;
      mask-image: linear-gradient(
        90deg,
        #000,
        #000 var(--vaadin-ai-field-marker-mask-pos),
        transparent calc(var(--vaadin-ai-field-marker-mask-pos) + 20px),
        transparent
      );
      animation: --vaadin-ai-field-marker-slide 700ms 200ms both;
      animation-timing-function: cubic-bezier(0.78, 0, 0.22, 1);
    }

    .badge {
      all: initial;
      position: absolute;
      top: -6px;
      inset-inline-end: -6px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      padding: 4px;
      border: none;
      border-radius: var(--vaadin-radius-m);
      margin: 0;
      background: transparent;
      color: var(--vaadin-ai-field-marker-badge-icon-color, var(--vaadin-text-color-secondary));
      font: inherit;
      font-size: 1rem;
      line-height: 1;
      cursor: pointer;
      transition: color 200ms;
      animation: --vaadin-ai-field-marker-fade-in 300ms 700ms backwards;

      &:hover {
        color: var(--vaadin-ai-field-marker-badge-icon-color, var(--vaadin-text-color));
      }

      &::before {
        content: '';
        display: block;
        width: 1lh;
        height: 1lh;
        background: currentColor;
        --_icon-ai-badge: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"><path d="M7.18848 8.48926H5.46289L6.32715 5.8623L7.18848 8.48926Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11 0C13.7614 0 16 2.23858 16 5V11C16 13.7614 13.7614 16 11 16H5C2.23858 16 0 13.7614 0 11V5C0 2.23858 2.23858 0 5 0H11ZM5.58203 4.52051L3.25977 11H4.63672L5.10742 9.56934H7.54297L8.01172 11H9.45215L7.12988 4.52051H5.58203ZM10.1211 4.52051V11H11.5068V4.52051H10.1211Z" fill="black"/></svg>');
        mask-image: var(--_icon-ai-badge);
      }

      &::after {
        content: '';
        position: absolute;
        width: 24px;
        height: 24px;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
      }
    }

    .badge:focus-visible {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    }

    > vaadin-popover::part(content) {
      display: flex;
      flex-direction: column;
      gap: var(--vaadin-gap-s);
      padding: var(--vaadin-padding-m);
      max-width: 20em;
    }

    .message {
      margin: 0;
    }

    /* The hidden AI-fill description linked to the field's input via
       aria-describedby: visually hidden but kept in the accessibility tree,
       using the sr-only styles from @vaadin/a11y-base. */
    ${screenReaderOnly}

    .actions {
      display: flex;
      gap: var(--vaadin-gap-xs);
    }

    .actions > button {
      display: flex;
      align-items: center;
      gap: var(--vaadin-gap-s);
      pointer-events: auto;
      box-sizing: border-box;
      padding: var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container);
      margin: calc(var(--vaadin-padding-block-container) * -1) calc(var(--vaadin-padding-inline-container) * -1);
      border: 0;
      border-radius: var(--vaadin-radius-m);
      background: transparent;
      color: var(--vaadin-text-color);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 100ms;

      &:hover {
        background: var(--vaadin-background-container);
      }

      &:active {
        background: var(--vaadin-background-container-strong);
      }

      &:focus-visible {
        outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      }

      &::before {
        content: '';
        display: inline-block;
        width: 1em;
        height: 1em;
        background: currentColor;
        mask: var(--_vaadin-icon-undo);
      }
    }
  }

  /* The confidence indicator: a sibling of the marker slotted into the
     field's helper text section. The level class name (low, medium, high)
     picks the color and how much of the pie icon is filled. */
  :has(> vaadin-ai-field-marker) > [slot='helper'].confidence {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-s);
    color: var(--_vaadin-ai-field-marker-confidence-color);

    &::before {
      content: '';
      flex: none;
      box-sizing: border-box;
      width: var(--vaadin-icon-size, 1lh);
      height: var(--vaadin-icon-size, 1lh);
      border: 1px solid color-mix(in srgb, currentColor 50%, transparent);
      border-radius: 50%;
      background-color: color-mix(in srgb, currentColor 15%, transparent);
      background-image: conic-gradient(currentColor var(--_vaadin-ai-field-marker-confidence-fill, 0%), #0000 0%);
    }

    &.low {
      --_vaadin-ai-field-marker-confidence-color: light-dark(#c5352e, #f2827b);
      --_vaadin-ai-field-marker-confidence-fill: 25%;
    }

    &.medium {
      --_vaadin-ai-field-marker-confidence-color: light-dark(#96640f, #e0b352);
      --_vaadin-ai-field-marker-confidence-fill: 50%;
    }

    &.high {
      --_vaadin-ai-field-marker-confidence-color: light-dark(#207c3c, #6ec886);
      --_vaadin-ai-field-marker-confidence-fill: 75%;
    }
  }

  /* While the AI is working, the confidence describes a value that is about
     to be replaced, so hide it along with the marker. */
  [ai-working] > [slot='helper'].confidence {
    display: none;
  }

  [ai-working],
  :has(> vaadin-ai-field-marker)::part(input-field),
  :has(> vaadin-ai-field-marker)::part(input-fields),
  :has(> vaadin-ai-field-marker)::part(group-field) {
    mask-image: linear-gradient(
      90deg,
      #000 calc(var(--vaadin-ai-field-marker-mask-pos) - 100px),
      rgba(0, 0, 0, 0.3) calc(var(--vaadin-ai-field-marker-mask-pos) - 70px),
      rgba(0, 0, 0, 0.3) var(--vaadin-ai-field-marker-mask-pos),
      #000 calc(var(--vaadin-ai-field-marker-mask-pos) + 70px),
      #000 calc(var(--vaadin-ai-field-marker-mask-pos) + 100px)
    );
    animation:
      --vaadin-ai-field-marker-slide 1s cubic-bezier(0.78, 0, 0.22, 1) forwards,
      --vaadin-ai-field-marker-remove-mask 0s 1s forwards;
  }

  [ai-working] {
    animation: --vaadin-ai-field-marker-slide 1s ease-in-out infinite;
  }

  /* While the AI is working, the badge and glow describe a value that is about
     to be replaced, so hide the marker until the field leaves the working
     state. Hiding rather than unmarking keeps the previous mark for a fill that
     is cancelled or fails. */
  [ai-working] > vaadin-ai-field-marker {
    display: none;
  }

  @keyframes --vaadin-ai-field-marker-fade-in {
    0% {
      opacity: 0;
    }
  }

  ${aiFieldMarkerHostStyles}
`;
