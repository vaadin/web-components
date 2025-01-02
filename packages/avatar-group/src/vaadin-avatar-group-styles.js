/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const avatarGroupStyles = css`
  :host {
    display: block;
    width: 100%; /* prevent collapsing inside non-stretching column flex */
    --vaadin-avatar-group-overlap: 8px;
    --vaadin-avatar-group-overlap-border: 2px;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='container'] {
    display: flex;
    position: relative;
    width: 100%;
    flex-wrap: nowrap;
  }

  ::slotted(vaadin-avatar:not(:first-child)) {
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox=%220 0 300 300%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path fill-rule=%22evenodd%22 clip-rule=%22evenodd%22 d=%22M300 0H0V300H300V0ZM150 200C177.614 200 200 177.614 200 150C200 122.386 177.614 100 150 100C122.386 100 100 122.386 100 150C100 177.614 122.386 200 150 200Z%22 fill=%22black%22/></svg>');
    mask-image: url('data:image/svg+xml;utf8,<svg viewBox=%220 0 300 300%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path fill-rule=%22evenodd%22 clip-rule=%22evenodd%22 d=%22M300 0H0V300H300V0ZM150 200C177.614 200 200 177.614 200 150C200 122.386 177.614 100 150 100C122.386 100 100 122.386 100 150C100 177.614 122.386 200 150 200Z%22 fill=%22black%22/></svg>');
    -webkit-mask-size: calc(
      300% + var(--vaadin-avatar-group-overlap-border) * 6 - var(--vaadin-avatar-outline-width) * 6
    );
    mask-size: calc(300% + var(--vaadin-avatar-group-overlap-border) * 6 - var(--vaadin-avatar-outline-width) * 6);
  }

  ::slotted(vaadin-avatar:not([dir='rtl']):not(:first-child)) {
    margin-left: calc(var(--vaadin-avatar-group-overlap) * -1 - var(--vaadin-avatar-outline-width));
    -webkit-mask-position: calc(50% - var(--vaadin-avatar-size) + var(--vaadin-avatar-group-overlap));
    mask-position: calc(50% - var(--vaadin-avatar-size) + var(--vaadin-avatar-group-overlap));
  }

  ::slotted(vaadin-avatar[dir='rtl']:not(:first-child)) {
    margin-right: calc(var(--vaadin-avatar-group-overlap) * -1);
    -webkit-mask-position: calc(
      50% + var(--vaadin-avatar-size) - var(--vaadin-avatar-group-overlap) + var(--vaadin-avatar-outline-width)
    );
    mask-position: calc(
      50% + var(--vaadin-avatar-size) - var(--vaadin-avatar-group-overlap) + var(--vaadin-avatar-outline-width)
    );
  }
`;
