/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: var(--_padding);
    gap: var(--_gap);
    --_padding: var(--vaadin-card-padding, 1em);
    --_gap: var(--vaadin-card-gap, 1em);
    --_media: 0;
    --_title: 0;
    --_subtitle: 0;
    --_header: max(var(--_header-prefix), var(--_title), var(--_subtitle), var(--_header-suffix));
    --_header-prefix: 0;
    --_header-suffix: 0;
    --_content: 0;
    --_footer: 0;
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

  :host([_m]) [part='media'],
  :host([_c]) [part='content'] {
    display: block;
  }

  :host([_f]) [part='footer'] {
    display: flex;
    gap: var(--_gap);
  }

  :host(:is([_h], [_t], [_st], [_hp], [_hs])) [part='header'] {
    display: grid;
    align-items: center;
    gap: var(--_gap);
    row-gap: 0;
  }

  :host([_hs]) [part='header'] {
    grid-template-columns: 1fr auto;
  }

  :host([_hp]) [part='header'] {
    grid-template-columns: repeat(var(--_header-prefix), auto) 1fr;
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

  ::slotted([slot='subtitle']) {
    grid-column: calc(1 + var(--_header-prefix));
    grid-row: calc(1 + var(--_title));
  }

  ::slotted([slot='header-suffix']) {
    grid-column: calc(2 + var(--_header-prefix));
    grid-row: 1 / span calc(var(--_title) + var(--_subtitle));
  }

  /* Horizontal */
  :host([theme~='horizontal']) {
    display: grid;
    grid-template-columns: repeat(var(--_media), minmax(auto, max-content)) 1fr;
    align-items: start;
  }

  :host([theme~='horizontal'][_f]) {
    grid-template-rows: 1fr auto;
  }

  :host([theme~='horizontal'][_c]) {
    grid-template-rows: repeat(var(--_header), auto) 1fr;
  }

  [part='media'] {
    grid-column: 1;
    grid-row: 1 / span calc(var(--_header) + var(--_content) + var(--_footer));
    align-self: stretch;
    border-radius: inherit;
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
    grid-column: calc(1 + var(--_media));
    grid-row: calc(1 + var(--_header) + var(--_content));
    border-radius: inherit;
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
    width: 100%;
    height: auto;
    aspect-ratio: var(--vaadin-card-media-aspect-ratio, 16/9);
    object-fit: cover;
    /* Fixes an issue where an icon overflows the card boundaries on Firefox: https://github.com/vaadin/web-components/issues/8641 */
    overflow: hidden;
  }

  :host([theme~='horizontal']:is([theme~='cover-media'], [theme~='stretch-media'])) {
    grid-template-columns: repeat(var(--_media), minmax(auto, 0.5fr)) 1fr;
  }

  :host([theme~='horizontal']:is([theme~='cover-media'], [theme~='stretch-media']))
    ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    height: 100%;
    aspect-ratio: auto;
  }

  :host([theme~='cover-media']) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    margin-top: calc(var(--_padding) * -1);
    margin-inline: calc(var(--_padding) * -1);
    width: calc(100% + var(--_padding) * 2);
    max-width: none;
    border-radius: inherit;
    border-end-end-radius: 0;
    border-end-start-radius: 0;
  }

  :host([theme~='horizontal'][theme~='cover-media']) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
    margin-inline-end: 0;
    width: calc(100% + var(--_padding));
    height: calc(100% + var(--_padding) * 2);
    border-radius: inherit;
    border-start-end-radius: 0;
    border-end-end-radius: 0;
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
`;
