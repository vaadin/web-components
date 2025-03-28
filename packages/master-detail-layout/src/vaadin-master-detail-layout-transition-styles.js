/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const transitionStyles = css`
  /* Overlay - horizontal - add */

  vaadin-master-detail-layout[overlay][orientation='horizontal'][transition='add']::part(detail) {
    view-transition-name: vaadin-master-detail-layout-overlay-horizontal-detail-add;
  }

  ::view-transition-group(vaadin-master-detail-layout-overlay-horizontal-detail-add) {
    clip-path: inset(0);
  }

  ::view-transition-new(vaadin-master-detail-layout-overlay-horizontal-detail-add) {
    animation: 300ms ease both vaadin-master-detail-layout-overlay-horizontal-detail-add;
  }

  @keyframes vaadin-master-detail-layout-overlay-horizontal-detail-add {
    from {
      transform: translateX(100%);
    }
  }

  /* Overlay - horizontal - remove */

  vaadin-master-detail-layout[overlay][orientation='horizontal'][transition='remove']::part(detail) {
    view-transition-name: vaadin-master-detail-layout-overlay-horizontal-detail-remove;
  }

  ::view-transition-group(vaadin-master-detail-layout-overlay-horizontal-detail-remove) {
    clip-path: inset(0);
  }

  ::view-transition-old(vaadin-master-detail-layout-overlay-horizontal-detail-remove) {
    animation: 300ms ease both vaadin-master-detail-layout-overlay-horizontal-detail-remove;
  }

  @keyframes vaadin-master-detail-layout-overlay-horizontal-detail-remove {
    to {
      transform: translateX(100%);
    }
  }

  /* Stack - horizontal - add */

  vaadin-master-detail-layout[stack][orientation='horizontal'][transition='add'] {
    view-transition-name: vaadin-master-detail-layout-stack-horizontal-add;
  }

  ::view-transition-group(vaadin-master-detail-layout-stack-horizontal-add) {
    clip-path: inset(0);
  }

  ::view-transition-new(vaadin-master-detail-layout-stack-horizontal-add) {
    animation: 300ms ease both vaadin-master-detail-layout-stack-horizontal-add-new;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-horizontal-add) {
    animation: 300ms ease both vaadin-master-detail-layout-stack-horizontal-add-old;
  }

  @keyframes vaadin-master-detail-layout-stack-horizontal-add-new {
    from {
      transform: translateX(100px);
      opacity: 0;
    }
  }

  @keyframes vaadin-master-detail-layout-stack-horizontal-add-old {
    to {
      transform: translateX(-100px);
      opacity: 0;
    }
  }

  /* Stack - horizontal - remove */

  vaadin-master-detail-layout[stack][orientation='horizontal'][transition='remove'] {
    view-transition-name: vaadin-master-detail-layout-stack-horizontal-remove;
  }

  ::view-transition-group(vaadin-master-detail-layout-stack-horizontal-remove) {
    clip-path: inset(0);
  }

  ::view-transition-new(vaadin-master-detail-layout-stack-horizontal-remove) {
    animation: 300ms ease both vaadin-master-detail-layout-stack-horizontal-remove-new;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-horizontal-remove) {
    animation: 300ms ease both vaadin-master-detail-layout-stack-horizontal-remove-old;
  }

  @keyframes vaadin-master-detail-layout-stack-horizontal-remove-new {
    from {
      transform: translateX(-100px);
      opacity: 0;
    }
  }

  @keyframes vaadin-master-detail-layout-stack-horizontal-remove-old {
    to {
      transform: translateX(100px);
      opacity: 0;
    }
  }

  /* Overlay - vertical - add */

  vaadin-master-detail-layout[overlay][orientation='vertical'][transition='add']::part(detail) {
    view-transition-name: vaadin-master-detail-layout-overlay-vertical-detail-add;
  }

  ::view-transition-group(vaadin-master-detail-layout-overlay-vertical-detail-add) {
    clip-path: inset(0);
  }

  ::view-transition-new(vaadin-master-detail-layout-overlay-vertical-detail-add) {
    animation: 300ms ease both vaadin-master-detail-layout-overlay-vertical-detail-add;
  }

  @keyframes vaadin-master-detail-layout-overlay-vertical-detail-add {
    from {
      transform: translateY(100%);
    }
  }

  /* Overlay - vertical - remove */

  vaadin-master-detail-layout[overlay][orientation='vertical'][transition='remove']::part(detail) {
    view-transition-name: vaadin-master-detail-layout-overlay-vertical-detail-remove;
  }

  ::view-transition-group(vaadin-master-detail-layout-overlay-vertical-detail-remove) {
    clip-path: inset(0);
  }

  ::view-transition-old(vaadin-master-detail-layout-overlay-vertical-detail-remove) {
    animation: 300ms ease both vaadin-master-detail-layout-overlay-vertical-detail-remove;
  }

  @keyframes vaadin-master-detail-layout-overlay-vertical-detail-remove {
    to {
      transform: translateY(100%);
    }
  }

  /* Stack - vertical - add */

  vaadin-master-detail-layout[stack][orientation='vertical'][transition='add'] {
    view-transition-name: vaadin-master-detail-layout-stack-vertical-add;
  }

  ::view-transition-group(vaadin-master-detail-layout-stack-vertical-add) {
    clip-path: inset(0);
  }

  ::view-transition-new(vaadin-master-detail-layout-stack-vertical-add) {
    animation: 300ms ease both vaadin-master-detail-layout-stack-vertical-add-new;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-vertical-add) {
    animation: 300ms ease both vaadin-master-detail-layout-stack-vertical-add-old;
  }

  @keyframes vaadin-master-detail-layout-stack-vertical-add-new {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
  }

  @keyframes vaadin-master-detail-layout-stack-vertical-add-old {
    to {
      transform: translateY(-100px);
      opacity: 0;
    }
  }

  /* Stack - vertical - remove */

  vaadin-master-detail-layout[stack][orientation='vertical'][transition='remove'] {
    view-transition-name: vaadin-master-detail-layout-stack-vertical-remove;
  }

  ::view-transition-group(vaadin-master-detail-layout-stack-vertical-remove) {
    clip-path: inset(0);
  }

  ::view-transition-new(vaadin-master-detail-layout-stack-vertical-remove) {
    animation: 300ms ease both vaadin-master-detail-layout-stack-vertical-remove-new;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-vertical-remove) {
    animation: 300ms ease both vaadin-master-detail-layout-stack-vertical-remove-old;
  }

  @keyframes vaadin-master-detail-layout-stack-vertical-remove-new {
    from {
      transform: translateY(-100px);
      opacity: 0;
    }
  }

  @keyframes vaadin-master-detail-layout-stack-vertical-remove-old {
    to {
      transform: translateY(100px);
      opacity: 0;
    }
  }
`;
