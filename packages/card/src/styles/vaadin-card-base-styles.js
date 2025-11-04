/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const cardStyles = css`
  :host {
    --_content: 0;
    --_footer: 0;
    --_gap: var(--vaadin-card-gap, var(--vaadin-gap-m));
    --_header: max(var(--_header-prefix), var(--_title), var(--_subtitle), var(--_header-suffix));
    --_header-prefix: 0;
    --_header-suffix: 0;
    --_media: 0;
    --_padding: var(--vaadin-card-padding, var(--vaadin-padding-m));
    --_subtitle: 0;
    --_title: 0;
    background: var(--vaadin-card-background, var(--vaadin-background-container));
    border-radius: var(--vaadin-card-border-radius, var(--vaadin-radius-m));
    box-shadow: var(--vaadin-card-shadow, none);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--_gap);
    padding: var(--_padding);
    position: relative;
  }

  /* Could be an inset outline on the host as well, but let's reserve that for a potential focus outline */
  :host::before {
    border: var(--vaadin-card-border-width, 0) solid
      var(--vaadin-card-border-color, var(--vaadin-border-color-secondary));
    border-radius: inherit;
    content: '';
    inset: 0;
    pointer-events: none;
    position: absolute;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([theme~='horizontal'])) {
    justify-content: space-between;
  }

  :host([_m]) {
    --_media: 1;
  }

  :host([_t]) {
    --_title: 1;
  }

  :host([_st]) {
    --_subtitle: 1;
  }

  :host([_h]) {
    --_header: 1;
    --_title: 0;
    --_subtitle: 0;
  }

  :host([_hp]) {
    --_header-prefix: 1;
  }

  :host([_hs]) {
    --_header-suffix: 1;
  }

  :host([_c]) {
    --_content: 1;
  }

  :host([_f]) {
    --_footer: 1;
  }

  [part='media'],
  [part='header'],
  [part='content'],
  [part='footer'] {
    display: none;
  }

  :host([_m]) [part='media'] {
    display: block;
  }

  :host(:is([_h], [_t], [_st], [_hp], [_hs])) [part='header'] {
    align-items: center;
    display: grid;
    gap: var(--_gap);
    row-gap: 0;
  }

  :host([_hs]) [part='header'] {
    grid-template-columns: 1fr auto;
  }

  :host([_hp]) [part='header'] {
    grid-template-columns: repeat(var(--_header-prefix), auto) 1fr;
  }

  :host([_c]) [part='content'] {
    display: block;
  }

  :host([_f]) [part='footer'] {
    display: flex;
    flex-wrap: wrap;
    gap: var(--_gap);
  }

  slot {
    border-radius: inherit;
  }

  ::slotted([slot='header-prefix']) {
    grid-column: 1;
    grid-row: 1 / span calc(var(--_title) + var(--_subtitle));
  }

  ::slotted([slot='header']),
  ::slotted([slot='title']) {
    grid-column: calc(1 + var(--_header-prefix));
    grid-row: 1;
  }

  ::slotted([slot='title']) {
    color: var(--vaadin-card-title-color, var(--vaadin-text-color)) !important;
    font-size: var(--vaadin-card-title-font-size, inherit) !important;
    font-weight: var(--vaadin-card-title-font-weight, 500) !important;
    line-height: var(--vaadin-card-title-line-height, inherit) !important;
    margin: 0 !important;
  }

  ::slotted([slot='subtitle']) {
    color: var(--vaadin-card-subtitle-color, var(--vaadin-text-color-secondary)) !important;
    font-size: var(--vaadin-card-subtitle-font-size, inherit) !important;
    font-weight: var(--vaadin-card-subtitle-font-weight, 400) !important;
    line-height: var(--vaadin-card-subtitle-line-height, inherit) !important;
    margin: 0 !important;
    grid-column: calc(1 + var(--_header-prefix));
    grid-row: calc(1 + var(--_title));
  }

  ::slotted([slot='header-suffix']) {
    grid-column: calc(2 + var(--_header-prefix));
    grid-row: 1 / span calc(var(--_title) + var(--_subtitle));
  }

  /* Horizontal */
  :host([theme~='horizontal']) {
    align-items: start;
    display: grid;
    grid-template-columns: repeat(var(--_media), minmax(auto, max-content)) 1fr;
  }

  :host([theme~='horizontal'][_f]) {
    grid-template-rows: 1fr auto;
  }

  :host([theme~='horizontal'][_c]) {
    grid-template-rows: repeat(var(--_header), auto) 1fr;
  }

  [part='media'] {
    align-self: stretch;
    border-radius: inherit;
    grid-column: 1;
    grid-row: 1 / span calc(var(--_header) + var(--_content) + var(--_footer));
  }

  [part='header'] {
    margin-bottom: auto;
    grid-column: calc(1 + var(--_media));
    grid-row: 1;
  }

  [part='content'] {
    grid-column: calc(1 + var(--_media));
    grid-row: calc(1 + var(--_header));
    flex: auto;
    min-height: 0;
  }

  [part='footer'] {
    border-radius: inherit;
    grid-column: calc(1 + var(--_media));
    grid-row: calc(1 + var(--_header) + var(--_content));
  }

  :host([theme~='horizontal']) [part='footer'] {
    align-self: end;
  }

  :host(:not([theme~='horizontal'])) ::slotted([slot='media']:is(img, video, svg)) {
    max-width: 100%;
  }

  ::slotted([slot='media']) {
    vertical-align: middle;
  }

  :host(:is([theme~='cover-media'], [theme~='stretch-media']))
    ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    aspect-ratio: var(--vaadin-card-media-aspect-ratio, 16/9);
    height: auto;
    object-fit: cover;
    /* Fixes an issue where an icon overflows the card boundaries on Firefox: https://github.com/vaadin/web-components/issues/8641 */
    overflow: hidden;
    width: 100%;
  }

  :host([theme~='horizontal']:is([theme~='cover-media'], [theme~='stretch-media'])) {
    grid-template-columns: repeat(var(--_media), minmax(auto, 0.5fr)) 1fr;
  }

  :host([theme~='horizontal']:is([theme~='cover-media'], [theme~='stretch-media']))
    ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    aspect-ratio: auto;
    height: 100%;
  }

  :host([theme~='cover-media']) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    border-radius: inherit;
    border-end-end-radius: 0;
    border-end-start-radius: 0;
    margin-inline: calc(var(--_padding) * -1);
    margin-top: calc(var(--_padding) * -1);
    max-width: none;
    width: calc(100% + var(--_padding) * 2);
  }

  :host([theme~='horizontal'][theme~='cover-media']) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    border-radius: inherit;
    border-end-end-radius: 0;
    border-start-end-radius: 0;
    height: calc(100% + var(--_padding) * 2);
    margin-inline-end: 0;
    width: calc(100% + var(--_padding));
  }

  /* Scroller in content */
  [part='content'] ::slotted(vaadin-scroller) {
    margin-inline: calc(var(--_padding) * -1);
    padding-inline: var(--_padding);
  }

  [part='content'] ::slotted(vaadin-scroller)::before,
  [part='content'] ::slotted(vaadin-scroller)::after {
    margin-inline: calc(var(--_padding) * -1);
  }

  /* Outlined */
  :host([theme~='outlined']) {
    --vaadin-card-border-width: 1px;
  }

  /* Elevated */
  :host([theme~='elevated']) {
    --vaadin-card-background: var(--vaadin-background-color);
    box-shadow: var(--vaadin-card-shadow, 0 1px 4px -1px rgba(0, 0, 0, 0.3));
  }
`;
