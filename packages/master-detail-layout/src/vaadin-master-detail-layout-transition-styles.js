/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const transitionStyles = css`
  html:not([dir='rtl']) {
    --_vaadin-master-detail-layout-dir-multiplier: 1;
  }

  html[dir='rtl'] {
    --_vaadin-master-detail-layout-dir-multiplier: -1;
  }

  /* Default cross-fade animation */
  vaadin-master-detail-layout[transition] {
    view-transition-name: vaadin-master-detail-layout;
  }

  ::view-transition-group(vaadin-master-detail-layout) {
    animation-duration: var(--vaadin-master-detail-layout-transition-duration, 300ms);
  }

  /* Drawer - horizontal - add */

  vaadin-master-detail-layout[drawer][orientation='horizontal'][transition='add']::part(detail) {
    view-transition-name: vaadin-master-detail-layout-drawer-horizontal-detail-add;
  }

  ::view-transition-group(vaadin-master-detail-layout-drawer-horizontal-detail-add) {
    clip-path: inset(0);
  }

  ::view-transition-new(vaadin-master-detail-layout-drawer-horizontal-detail-add) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-drawer-horizontal-detail-add;
  }

  @keyframes vaadin-master-detail-layout-drawer-horizontal-detail-add {
    from {
      transform: translateX(calc(100% * var(--_vaadin-master-detail-layout-dir-multiplier)));
    }
  }

  /* Drawer - horizontal - remove */

  vaadin-master-detail-layout[drawer][orientation='horizontal'][transition='remove']::part(detail) {
    view-transition-name: vaadin-master-detail-layout-drawer-horizontal-detail-remove;
  }

  ::view-transition-group(vaadin-master-detail-layout-drawer-horizontal-detail-remove) {
    clip-path: inset(0);
  }

  ::view-transition-old(vaadin-master-detail-layout-drawer-horizontal-detail-remove) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-drawer-horizontal-detail-remove;
  }

  @keyframes vaadin-master-detail-layout-drawer-horizontal-detail-remove {
    to {
      transform: translateX(calc(100% * var(--_vaadin-master-detail-layout-dir-multiplier)));
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
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-horizontal-add-new;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-horizontal-add) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-horizontal-add-old;
  }

  @keyframes vaadin-master-detail-layout-stack-horizontal-add-new {
    from {
      transform: translateX(calc(100px * var(--_vaadin-master-detail-layout-dir-multiplier)));
      opacity: 0;
    }
  }

  @keyframes vaadin-master-detail-layout-stack-horizontal-add-old {
    to {
      transform: translateX(calc(-100px * var(--_vaadin-master-detail-layout-dir-multiplier)));
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
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-horizontal-remove-new;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-horizontal-remove) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-horizontal-remove-old;
  }

  @keyframes vaadin-master-detail-layout-stack-horizontal-remove-new {
    from {
      transform: translateX(calc(-100px * var(--_vaadin-master-detail-layout-dir-multiplier)));
      opacity: 0;
    }
  }

  @keyframes vaadin-master-detail-layout-stack-horizontal-remove-old {
    to {
      transform: translateX(calc(100px * var(--_vaadin-master-detail-layout-dir-multiplier)));
      opacity: 0;
    }
  }

  /* Stack - horizontal - viewport - add */

  vaadin-master-detail-layout[stack][orientation='horizontal'][containment='viewport'][transition='add'] {
    view-transition-name: vaadin-master-detail-layout-stack-horizontal-viewport-add;
  }

  ::view-transition-new(vaadin-master-detail-layout-stack-horizontal-viewport-add) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-horizontal-add-new;
  }

  /* Stack - horizontal - viewport - remove */

  vaadin-master-detail-layout[stack][orientation='horizontal'][containment='viewport'][transition='remove'] {
    view-transition-name: vaadin-master-detail-layout-stack-horizontal-viewport-remove;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-horizontal-viewport-remove) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-horizontal-remove-old;
  }

  /* Drawer - vertical - add */

  vaadin-master-detail-layout[drawer][orientation='vertical'][transition='add']::part(detail) {
    view-transition-name: vaadin-master-detail-layout-drawer-vertical-detail-add;
  }

  ::view-transition-group(vaadin-master-detail-layout-drawer-vertical-detail-add) {
    clip-path: inset(0);
  }

  ::view-transition-new(vaadin-master-detail-layout-drawer-vertical-detail-add) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-drawer-vertical-detail-add;
  }

  @keyframes vaadin-master-detail-layout-drawer-vertical-detail-add {
    from {
      transform: translateY(100%);
    }
  }

  /* Drawer - vertical - remove */

  vaadin-master-detail-layout[drawer][orientation='vertical'][transition='remove']::part(detail) {
    view-transition-name: vaadin-master-detail-layout-drawer-vertical-detail-remove;
  }

  ::view-transition-group(vaadin-master-detail-layout-drawer-vertical-detail-remove) {
    clip-path: inset(0);
  }

  ::view-transition-old(vaadin-master-detail-layout-drawer-vertical-detail-remove) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-drawer-vertical-detail-remove;
  }

  @keyframes vaadin-master-detail-layout-drawer-vertical-detail-remove {
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
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-vertical-add-new;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-vertical-add) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-vertical-add-old;
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
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-vertical-remove-new;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-vertical-remove) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-vertical-remove-old;
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

  /* Stack - vertical - viewport - add */

  vaadin-master-detail-layout[stack][orientation='vertical'][containment='viewport'][transition='add'] {
    view-transition-name: vaadin-master-detail-layout-stack-vertical-viewport-add;
  }

  ::view-transition-new(vaadin-master-detail-layout-stack-vertical-viewport-add) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-vertical-add-new;
  }

  /* Stack - vertical - viewport - remove */

  vaadin-master-detail-layout[stack][orientation='vertical'][containment='viewport'][transition='remove'] {
    view-transition-name: vaadin-master-detail-layout-stack-vertical-viewport-remove;
  }

  ::view-transition-old(vaadin-master-detail-layout-stack-vertical-viewport-remove) {
    animation: var(--vaadin-master-detail-layout-transition-duration, 300ms) ease both
      vaadin-master-detail-layout-stack-vertical-remove-old;
  }
`;
