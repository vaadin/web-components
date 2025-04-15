/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const transitionStyles = css`
  @media (prefers-reduced-motion: no-preference) {
    html {
      --_vaadin-mdl-dir-multiplier: 1;
      --_vaadin-mdl-stack-master-offset: 20%;
      --_vaadin-mdl-stack-master-clip-path: inset(0 0 0 var(--_vaadin-mdl-stack-master-offset));
    }

    html[dir='rtl'] {
      --_vaadin-mdl-dir-multiplier: -1;
      --_vaadin-mdl-stack-master-clip-path: inset(0 var(--_vaadin-mdl-stack-master-offset) 0 0);
    }

    ::view-transition-group(vaadin-master-detail-layout-master),
    ::view-transition-group(vaadin-master-detail-layout-detail) {
      animation-duration: 0.25s;
    }

    vaadin-master-detail-layout[transition]:not([transition='replace']):not([overlay], [stack])::part(detail),
    vaadin-master-detail-layout[transition]:is([overlay], [stack])::part(_detail-internal) {
      view-transition-name: vaadin-master-detail-layout-detail;
    }

    ::view-transition-group(vaadin-master-detail-layout-detail) {
      clip-path: inset(0);
    }

    ::view-transition-new(vaadin-master-detail-layout-detail),
    ::view-transition-old(vaadin-master-detail-layout-detail) {
      animation-name: vaadin-mdl-detail-slide-in;
    }

    ::view-transition-old(vaadin-master-detail-layout-detail) {
      animation-direction: reverse;
    }

    @keyframes vaadin-mdl-detail-slide-in {
      0% {
        translate: calc((100% + 30px) * var(--_vaadin-mdl-dir-multiplier));
      }
    }

    vaadin-master-detail-layout[orientation='horizontal'][stack][has-detail]::part(master) {
      translate: calc(var(--_vaadin-mdl-stack-master-offset) * var(--_vaadin-mdl-dir-multiplier) * -1);
      opacity: 0;
    }

    vaadin-master-detail-layout[transition]::part(master) {
      view-transition-name: vaadin-master-detail-layout-master;
    }

    vaadin-master-detail-layout[orientation='horizontal'][stack][transition='add']::part(master) {
      view-transition-class: stack-add;
    }

    vaadin-master-detail-layout[orientation='horizontal'][stack][transition='remove']::part(master) {
      view-transition-class: stack-remove;
    }

    ::view-transition-new(vaadin-master-detail-layout-master),
    ::view-transition-old(vaadin-master-detail-layout-master) {
      object-fit: none;
      object-position: 0 0;
    }

    ::view-transition-new(vaadin-master-detail-layout-master.stack-remove),
    ::view-transition-old(vaadin-master-detail-layout-master.stack-remove) {
      animation-name: vaadin-mdl-master-stack-remove;
      clip-path: var(--_vaadin-mdl-stack-master-clip-path);
    }

    @keyframes vaadin-mdl-master-stack-remove {
      100% {
        clip-path: inset(0);
      }
    }

    ::view-transition-new(vaadin-master-detail-layout-master.stack-add),
    ::view-transition-old(vaadin-master-detail-layout-master.stack-add) {
      animation-name: vaadin-mdl-master-stack-add;
      clip-path: inset(0);
    }

    @keyframes vaadin-mdl-master-stack-add {
      100% {
        clip-path: var(--_vaadin-mdl-stack-master-clip-path);
      }
    }

    vaadin-master-detail-layout[orientation='vertical']:not([overlay], [stack])[transition]:not(
        [transition='replace']
      )::part(detail),
    vaadin-master-detail-layout[orientation='vertical']:is([overlay], [stack])[transition]::part(_detail-internal) {
      view-transition-name: vaadin-master-detail-layout-detail;
      view-transition-class: vertical;
    }

    ::view-transition-new(vaadin-master-detail-layout-detail.vertical),
    ::view-transition-old(vaadin-master-detail-layout-detail.vertical) {
      animation-name: vaadin-mdl-vertical-detail-slide-in;
    }

    ::view-transition-old(vaadin-master-detail-layout-detail.vertical) {
      animation-direction: reverse;
    }

    @keyframes vaadin-mdl-vertical-detail-slide-in {
      0% {
        transform: translateY(calc(100% + 30px));
      }
    }
  }
`;
