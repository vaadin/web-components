/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const masterDetailLayoutTransitionStyles = css`
  @media (prefers-reduced-motion: no-preference) {
    html {
      --_vaadin-mdl-dir-multiplier: 1;
      --_vaadin-mdl-stack-master-offset: 20%;
      --_vaadin-mdl-stack-master-clip-path: inset(0 0 0 var(--_vaadin-mdl-stack-master-offset));
      --_vaadin-mdl-easing: cubic-bezier(0.78, 0, 0.22, 1);
    }

    html[dir='rtl'] {
      --_vaadin-mdl-dir-multiplier: -1;
      --_vaadin-mdl-stack-master-clip-path: inset(0 var(--_vaadin-mdl-stack-master-offset) 0 0);
    }

    ::view-transition-group(vaadin-mdl-backdrop),
    ::view-transition-group(vaadin-mdl-master),
    ::view-transition-group(vaadin-mdl-detail) {
      animation-duration: 0.4s;
    }

    ::view-transition-group(vaadin-mdl-master),
    ::view-transition-group(vaadin-mdl-detail) {
      animation-timing-function: var(--_vaadin-mdl-easing);
    }

    ::view-transition-image-pair(vaadin-mdl-master),
    ::view-transition-image-pair(vaadin-mdl-detail),
    ::view-transition-new(vaadin-mdl-master),
    ::view-transition-new(vaadin-mdl-detail),
    ::view-transition-old(vaadin-mdl-master),
    ::view-transition-old(vaadin-mdl-detail) {
      animation-timing-function: inherit;
    }

    /* Needed to promote the backdrop on top the master during the transition */
    vaadin-master-detail-layout[transition]::part(backdrop) {
      view-transition-name: vaadin-mdl-backdrop;
    }

    vaadin-master-detail-layout[transition][has-detail]:not([transition='replace']):not([overflow])::part(detail),
    vaadin-master-detail-layout[transition][has-detail][overflow]::part(detail) {
      view-transition-name: vaadin-mdl-detail;
    }

    ::view-transition-group(vaadin-mdl-detail) {
      clip-path: inset(0);
    }

    ::view-transition-new(vaadin-mdl-detail),
    ::view-transition-old(vaadin-mdl-detail) {
      animation-name: vaadin-mdl-detail-slide-in;
    }

    ::view-transition-old(vaadin-mdl-detail) {
      animation-direction: reverse;
    }

    @keyframes vaadin-mdl-detail-slide-in {
      0% {
        translate: calc((100% + 30px) * var(--_vaadin-mdl-dir-multiplier));
      }
    }

    vaadin-master-detail-layout[orientation='horizontal'][has-detail][overflow][detail-overlay-mode^='full']::part(
        master
      ) {
      translate: calc(var(--_vaadin-mdl-stack-master-offset) * var(--_vaadin-mdl-dir-multiplier) * -1);
      opacity: 0;
    }

    vaadin-master-detail-layout[transition]::part(master) {
      view-transition-name: vaadin-mdl-master;
    }

    vaadin-master-detail-layout[orientation='horizontal'][has-detail][overflow][detail-overlay-mode^='full'][transition='add']::part(
        master
      ) {
      view-transition-class: stack-add;
    }

    vaadin-master-detail-layout[orientation='horizontal'][has-detail][overflow][detail-overlay-mode^='full'][transition='remove']::part(
        master
      ) {
      view-transition-class: stack-remove;
    }

    ::view-transition-new(vaadin-mdl-master),
    ::view-transition-old(vaadin-mdl-master) {
      object-fit: none;
      object-position: 0% 0;
      width: 100%;
      height: 100%;
    }

    :dir(rtl)::view-transition-new(vaadin-mdl-master),
    :dir(rtl)::view-transition-old(vaadin-mdl-master) {
      object-position: 100% 0;
    }

    ::view-transition-new(vaadin-mdl-master.stack-remove),
    ::view-transition-old(vaadin-mdl-master.stack-remove) {
      animation-name: vaadin-mdl-master-stack-remove;
      clip-path: var(--_vaadin-mdl-stack-master-clip-path);
    }

    @keyframes vaadin-mdl-master-stack-remove {
      100% {
        clip-path: inset(0);
      }
    }

    ::view-transition-new(vaadin-mdl-master.stack-add),
    ::view-transition-old(vaadin-mdl-master.stack-add) {
      animation-name: vaadin-mdl-master-stack-add;
      clip-path: inset(0);
    }

    @keyframes vaadin-mdl-master-stack-add {
      100% {
        clip-path: var(--_vaadin-mdl-stack-master-clip-path);
      }
    }

    /* prettier-ignore */
    vaadin-master-detail-layout[orientation='vertical'][has-detail]:not([overflow])[transition]:not([transition='replace'])::part(detail),
    vaadin-master-detail-layout[orientation='vertical'][has-detail][overflow][transition]::part(detail) {
      view-transition-name: vaadin-mdl-detail;
      view-transition-class: vertical;
    }

    ::view-transition-new(vaadin-mdl-detail.vertical),
    ::view-transition-old(vaadin-mdl-detail.vertical) {
      animation-name: vaadin-mdl-vertical-detail-slide-in;
    }

    ::view-transition-old(vaadin-mdl-detail.vertical) {
      animation-direction: reverse;
    }

    @keyframes vaadin-mdl-vertical-detail-slide-in {
      0% {
        transform: translateY(calc(100% + 30px));
      }
    }
  }
`;
