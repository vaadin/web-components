/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const aiFieldMarkerHostStyles = css`
  @keyframes --ai-marker-slide {
    0% {
      --vaadin-ai-marker-mask-pos: -100px;
    }

    100% {
      --vaadin-ai-marker-mask-pos: calc(100% + 100px);
    }
  }

  @keyframes --ai-marker-remove-mask {
    100% {
      mask-image: none;
    }
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

  @property --vaadin-ai-marker-mask-pos {
    syntax: '<length-percentage>';
    inherits: false;
    initial-value: 0;
  }

  vaadin-ai-field-marker {
    display: contents;
    --color1: light-dark(#932fffd9, #bc64ff);
    --color2: light-dark(#004cffcc, #539aff);

    &::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 9px;
      z-index: -1;
      pointer-events: none;
      background-color: color-mix(in srgb, var(--color2) 30%, transparent);
      background-image:
        radial-gradient(66.92% 123.25% at 100% 88.78%, var(--color1) 0%, transparent 100%),
        radial-gradient(42.57% 69.91% at 14.85% 33.33%, var(--color2) 0%, transparent 100%);
      opacity: 0.16;
      mask-image: linear-gradient(
        90deg,
        #000,
        #000 var(--vaadin-ai-marker-mask-pos),
        transparent calc(var(--vaadin-ai-marker-mask-pos) + 20px),
        transparent
      );
      animation: --ai-marker-slide 700ms 200ms both;
      animation-timing-function: cubic-bezier(0.78, 0, 0.22, 1);
    }
  }

  .ai-working,
  :has(> vaadin-ai-field-marker)::part(input-field),
  :has(> vaadin-ai-field-marker)::part(group-field) {
    mask-image: linear-gradient(
      90deg,
      #000 calc(var(--vaadin-ai-marker-mask-pos) - 100px),
      rgba(0, 0, 0, 0.3) calc(var(--vaadin-ai-marker-mask-pos) - 70px),
      rgba(0, 0, 0, 0.3) var(--vaadin-ai-marker-mask-pos),
      #000 calc(var(--vaadin-ai-marker-mask-pos) + 70px),
      #000 calc(var(--vaadin-ai-marker-mask-pos) + 100px)
    );
    animation:
      --ai-marker-slide 1s cubic-bezier(0.78, 0, 0.22, 1) forwards,
      --ai-marker-remove-mask 0s 1s forwards;
  }

  .ai-working {
    animation: --ai-marker-slide 1s ease-in-out infinite;
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }
  }

  @scope (vaadin-ai-field-marker) {
    [part='badge'] {
      position: absolute;
      top: -6px;
      inset-inline-end: -6px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      padding: 3px 4px;
      border: none;
      border-radius: 0 5px;
      margin: 0;
      background: var(--vaadin-ai-marker-badge-background, linear-gradient(135deg, var(--color1), var(--color2)));
      color: var(--vaadin-ai-marker-badge-color, light-dark(#fff, #000));
      font: inherit;
      font-size: 10px;
      font-weight: 600;
      line-height: 1;
      letter-spacing: 0.05em;
      cursor: pointer;
      opacity: 0.75;
      transition: opacity 200ms;
      animation: fade-in 300ms 700ms backwards;

      &:hover {
        opacity: 1;
      }

      &::before {
        content: '';
        position: absolute;
        width: 24px;
        height: 24px;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
      }
    }

    [part='badge']:focus-visible {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
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
      border: 1px solid var(--vaadin-ai-marker-accent-color, var(--color1));
      border-radius: 0.25rem;
      background: transparent;
      color: var(--vaadin-ai-marker-accent-color, var(--color1));
      font: inherit;
      cursor: pointer;
    }

    [part='revert-button']:focus-visible {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: 2px;
    }
  }

  ${aiFieldMarkerHostStyles}
`;
