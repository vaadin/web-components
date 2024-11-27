/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-card>` is a visual content container.
 *
 * ```html
 * <vaadin-card>
 *   <div>Card content</div>
 * </vaadin-card>
 * ```
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Card extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-card';
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        padding: var(--vaadin-card-padding);
      }

      :host(:not([theme~='horizontal'])) {
        row-gap: var(--vaadin-card-row-gap);
        grid-template-columns: 1fr minmax(0, auto);
        grid-template-rows: repeat(auto-fit, minmax(min-content, 0));
        justify-items: start;
        grid-auto-flow: dense;
      }

      slot {
        border-radius: inherit;
      }

      ::slotted(:not([slot], :only-child, :first-child)) {
        margin-top: var(--vaadin-card-gap);
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='media']) {
        grid-column: auto / span 2;
      }

      :host(:where([theme~='cover-media'], [theme~='stretch-media'])) ::slotted([slot='media']) {
        max-width: none;
        width: 100%;
        height: auto;
        aspect-ratio: var(--vaadin-card-media-aspect-ratio, 16/9);
        object-fit: cover;
        align-self: stretch;
        /* TODO looks like a missing property from avatar */
        box-sizing: border-box;
      }

      :host(:where([theme~='cover-media'], [theme~='stretch-media'])) ::slotted([slot='media']:only-child) {
        aspect-ratio: auto;
        align-self: stretch;
      }

      :host(:where([theme~='stretch-media'])) ::slotted([slot='media']) {
        margin: calc(var(--vaadin-card-padding) * -1);
        border-radius: inherit;
        width: calc(100% + var(--vaadin-card-padding) * 2);
      }

      :host(:where([theme~='cover-media'], [theme~='stretch-media']):not([theme~='horizontal']))
        ::slotted([slot='media']:not(:only-child)) {
        margin-bottom: calc(var(--vaadin-card-padding) - var(--vaadin-card-row-gap));
      }

      :host([theme~='stretch-media']:not([theme~='horizontal'])) ::slotted([slot='media']:not(:only-child)) {
        border-end-start-radius: 0;
        border-end-end-radius: 0;
      }

      ::slotted([slot='title']) {
        align-self: center;
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='title']) {
        grid-column: 1;
      }

      ::slotted([slot='subtitle']) {
        align-self: center;
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='subtitle']) {
        margin-top: calc(var(--vaadin-card-row-gap) * -1);
        grid-column: 1;
      }

      ::slotted([slot='title-suffix']) {
        align-self: center;
        justify-self: end;
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='title-suffix']) {
        grid-row: auto / span 2;
        grid-column: 2;
      }

      :host(:not([theme~='horizontal'])) ::slotted(:not([slot])) {
        grid-column: auto / span 2;
      }

      :host(:not([theme~='horizontal'])) ::slotted(:not([slot]):only-child) {
        grid-row: 1 / span 2;
      }

      :host(:not([theme~='horizontal'])) ::slotted(*:only-child) {
        grid-row: 1 / span 2;
        grid-column: 1;
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='suffix']) {
        grid-row: -1;
        align-self: end;
        grid-column: auto / span 2;
      }

      :host([theme~='horizontal']) {
        column-gap: var(--vaadin-card-column-gap);
        grid-template-rows: minmax(min-content, 0) minmax(min-content, 0);
        --vaadin-card-media-aspect-ratio: 1;
      }

      :host([theme~='horizontal']) ::slotted([slot='media']) {
        grid-row: 1 / span 3;
      }

      :host([theme~='horizontal']) ::slotted([slot='title']) {
        grid-row: 1;
      }

      :host([theme~='horizontal']) ::slotted([slot='subtitle']) {
        grid-row: 2;
      }

      :host([theme~='horizontal']) ::slotted([slot='title-suffix']),
      :host([theme~='horizontal']) slot[name='title-suffix'] span {
        grid-row: 1 / span 2;
      }

      :host([theme~='horizontal']) ::slotted([slot='suffix']) {
        align-self: center;
        grid-row: 1 / span 3;
      }

      :host([theme~='horizontal']) ::slotted(:not([slot])) {
        grid-column: auto / span 2;
      }

      :host([theme~='horizontal']) ::slotted(:not([slot], :only-child, :first-child)) {
        margin-top: var(--vaadin-card-row-gap);
      }

      :host([theme~='stretch-media'][theme~='horizontal']) ::slotted([slot='media']) {
        margin-inline-end: 0;
        border-start-end-radius: 0;
        border-end-end-radius: 0;
        width: calc(100% + var(--vaadin-card-padding));
      }

      :host([theme~='stretch-media'][theme~='horizontal']) ::slotted([slot='media']:only-child) {
        max-width: calc(100% + var(--vaadin-card-padding) * 2);
        border-radius: inherit;
        grid-row: -1;
      }
    `;
  }

  static get experimental() {
    return true;
  }

  /** @protected */
  render() {
    return html`
      <slot name="media"></slot>
      <slot name="title"></slot>
      <slot name="subtitle"></slot>
      <slot name="title-suffix"><span></span></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `;
  }
}

defineCustomElement(Card);

export { Card };
