/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
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
        column-gap: var(--vaadin-card-column-gap);
        row-gap: var(--vaadin-card-row-gap);
        grid-auto-flow: dense;
        justify-items: start;
        align-content: start;

        --media: 0;
        --title: 0;
        --subtitle: 0;
        --title-suffix: 0;
        --content: 0;
        --suffix: 0;
      }

      :host(:not([theme~='horizontal'])) {
        grid-template-columns: 1fr repeat(var(--title-suffix), auto);
        grid-template-rows: auto auto auto repeat(var(--content), 1fr);
      }

      :host([theme~='horizontal']) {
        grid-template-columns: [media-start] auto [media-end content-start title-start subtitle-start] 1fr [title-end subtitle-end title-suffix-start] auto [content-end title-suffix-end suffix-start] auto [suffix-end];
        grid-template-rows: [title-start] auto [title-end subtitle-start] auto [subtitle-end content-start] 1fr [content-end];
      }

      :host(:is(:has([slot='media']), [has-media])) {
        --media: 1;
      }

      :host(:is(:has([slot='title']), [has-title])) {
        --title: 1;
      }

      :host(:is(:has([slot='subtitle']), [has-subtitle])) {
        --subtitle: 1;
      }

      :host(:is(:has([slot='title-suffix']), [has-title-suffix])) {
        --title-suffix: 1;
      }

      :host(:is(:has(:scope > :not([slot])), [has-content])) {
        --content: 1;
      }

      :host(:is(:has([slot='suffix']), [has-suffix])) {
        --suffix: 1;
      }

      :host(:not([theme~='horizontal'])) ::slotted(*) {
        grid-column: 1 / -1;
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='media']) {
        grid-row-start: 1;
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='title']) {
        grid-row-start: calc(1 + var(--media));
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='subtitle']) {
        grid-row-start: calc(1 + var(--media) + var(--title));
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='title-suffix']) {
        grid-column: 2;
        grid-row-start: calc(1 + var(--media));
        grid-row-end: calc(1 + var(--media) + var(--title) + var(--subtitle));
        align-self: center;
      }

      :host(:not([theme~='horizontal'])) ::slotted(:is([slot='title'], [slot='subtitle'])) {
        grid-column: 1 / calc(-1 - var(--title-suffix));
      }

      :host(:not([theme~='horizontal'])) ::slotted(:not([slot])) {
        grid-row-start: calc(1 + var(--media) + var(--title) + var(--subtitle));
        align-self: stretch;
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='suffix']) {
        grid-row-start: calc(1 + var(--media) + var(--title) + var(--subtitle) + var(--content));
        align-self: end;
      }

      /* Last element spans any remaining rows. This assumes that the last child is also the last visible slotted row. */
      :host(:not([theme~='horizontal'])) ::slotted(:last-child) {
        grid-row-end: span calc(6 - var(--media) - var(--title) - var(--subtitle) - var(--content) - var(--suffix));
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
      <slot name="title-suffix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `;
  }

  /** @private */
  _mutationObserver;

  /** @private */
  _onMutation() {
    this.toggleAttribute('has-media', this.querySelector(':scope > [slot="media"]'));
    this.toggleAttribute('has-title', this.querySelector(':scope > [slot="title"]'));
    this.toggleAttribute('has-subtitle', this.querySelector(':scope > [slot="subtitle"]'));
    this.toggleAttribute('has-title-suffix', this.querySelector(':scope > [slot="title-suffix"]'));
    this.toggleAttribute('has-content', this.querySelector(':scope > :not([slot])'));
    this.toggleAttribute('has-suffix', this.querySelector(':scope > [slot="suffix"]'));
  }

  connectedCallback() {
    super.connectedCallback();

    if (!CSS.supports('selector(:host(:has([slot])))')) {
      if (!this._mutationObserver) {
        this._mutationObserver = new MutationObserver(this._onMutation.bind(this));
      }
      this._mutationObserver.observe(this, { childList: 'true' });
    }
  }

  disconnectedCallback() {
    if (this._mutationObserver) this._mutationObserver.disconnect();
    super.disconnectedCallback();
  }
}

defineCustomElement(Card);

export { Card };
