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
        display: flex;
        flex-direction: column;
        padding: var(--vaadin-card-padding);
        gap: var(--vaadin-card-gap);

        --media: 0;
        --title: 0;
        --subtitle: 0;
        --header: max(var(--header-prefix), var(--title), var(--subtitle), var(--header-suffix));
        --header-prefix: 0;
        --header-suffix: 0;
        --content: 0;
        --footer: 0;
      }

      :host(:not([theme~='horizontal'])) {
        justify-content: space-between;
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

      :host(:is(:has([slot='header']), [has-header])) {
        --header: 1;
        --title: 0;
        --subtitle: 0;
      }

      :host(:is(:has([slot='header-prefix']), [has-header-prefix])) {
        --header-prefix: 1;
      }

      :host(:is(:has([slot='header-suffix']), [has-header-suffix])) {
        --header-suffix: 1;
      }

      :host(:is(:has(> :not([slot])), [has-content])) {
        --content: 1;
      }

      :host(:is(:has([slot='footer']), [has-footer])) {
        --footer: 1;
      }

      [part='media'],
      [part='header'],
      [part='content'],
      [part='footer'] {
        display: none;
      }

      :host(:is(:has([slot='media']), [has-media])) [part='media'],
      :host(:is(:has(> :not([slot])), [has-content])) [part='content'] {
        display: block;
      }

      :host(:is(:has([slot='footer']), [has-footer])) [part='footer'] {
        display: flex;
        gap: var(--vaadin-card-gap);
      }

      :host(
          :is(
              :has([slot='header']),
              [has-header],
              :has([slot='title']),
              [has-title],
              :has([slot='subtitle']),
              [has-subtitle],
              :has([slot='header-prefix']),
              [has-header-prefix],
              :has([slot='header-suffix']),
              [has-header-suffix]
            )
        )
        [part='header'] {
        display: grid;
        align-items: center;
        gap: var(--vaadin-card-gap);
        row-gap: 0;
      }

      [part='header'] {
        margin-bottom: auto;
      }

      :host(:is(:has([slot='header-suffix']), [has-header-suffix])) [part='header'] {
        grid-template-columns: 1fr auto;
      }

      :host(:is(:has([slot='header-prefix']), [has-header-prefix])) [part='header'] {
        grid-template-columns: repeat(var(--header-prefix), auto) 1fr;
      }

      slot {
        border-radius: inherit;
      }

      ::slotted([slot='header-prefix']) {
        grid-column: 1;
        grid-row: 1 / span calc(var(--title) + var(--subtitle));
      }

      ::slotted([slot='header']),
      ::slotted([slot='title']) {
        grid-column: calc(1 + var(--header-prefix));
        grid-row: 1;
      }

      ::slotted([slot='subtitle']) {
        grid-column: calc(1 + var(--header-prefix));
        grid-row: calc(1 + var(--title));
      }

      ::slotted([slot='header-suffix']) {
        grid-column: calc(2 + var(--header-prefix));
        grid-row: 1 / span calc(var(--title) + var(--subtitle));
      }

      /* Horizontal */
      :host([theme~='horizontal']) {
        display: grid;
        grid-template-columns: repeat(var(--media), minmax(auto, max-content)) 1fr;
        align-items: start;
      }

      :host([theme~='horizontal']:is(:has([slot='footer']), [has-footer])) {
        grid-template-rows: 1fr auto;
      }

      :host([theme~='horizontal']:is(:has(> :not([slot])), [has-content])) {
        grid-template-rows: repeat(var(--header), auto) 1fr;
      }

      [part='media'] {
        grid-column: 1;
        grid-row: 1 / span calc(var(--header) + var(--content) + var(--footer));
        align-self: stretch;
        border-radius: inherit;
      }

      [part='header'] {
        grid-column: calc(1 + var(--media));
        grid-row: 1;
      }

      [part='content'] {
        grid-column: calc(1 + var(--media));
        grid-row: calc(1 + var(--header));
        flex: auto;
        min-height: 0;
      }

      [part='footer'] {
        grid-column: calc(1 + var(--media));
        grid-row: calc(1 + var(--header) + var(--content));
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
      }

      :host([theme~='horizontal']:is([theme~='cover-media'], [theme~='stretch-media'])) {
        grid-template-columns: repeat(var(--media), minmax(auto, 0.5fr)) 1fr;
      }

      :host([theme~='horizontal']:is([theme~='cover-media'], [theme~='stretch-media']))
        ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
        height: 100%;
        aspect-ratio: auto;
      }

      :host([theme~='cover-media']) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
        margin-top: calc(var(--vaadin-card-padding) * -1);
        margin-inline: calc(var(--vaadin-card-padding) * -1);
        width: calc(100% + var(--vaadin-card-padding) * 2);
        max-width: none;
        border-radius: inherit;
        border-end-end-radius: 0;
        border-end-start-radius: 0;
      }

      :host([theme~='horizontal'][theme~='cover-media']) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
        margin-inline-end: 0;
        width: calc(100% + var(--vaadin-card-padding));
        height: calc(100% + var(--vaadin-card-padding) * 2);
        border-radius: inherit;
        border-start-end-radius: 0;
        border-end-end-radius: 0;
      }

      /* Scroller in content */
      [part='content'] ::slotted(vaadin-scroller) {
        margin-inline: calc(var(--vaadin-card-padding) * -1);
        padding-inline: var(--vaadin-card-padding);
      }

      [part='content'] ::slotted(vaadin-scroller)::before,
      [part='content'] ::slotted(vaadin-scroller)::after {
        margin-inline: calc(var(--vaadin-card-padding) * -1);
      }
    `;
  }

  static get experimental() {
    return true;
  }

  /** @protected */
  render() {
    return html`
      <div part="media">
        <slot name="media"></slot>
      </div>
      <div part="header">
        <slot name="header-prefix"></slot>
        <slot name="header">
          <slot name="title"></slot>
          <slot name="subtitle"></slot>
        </slot>
        <slot name="header-suffix"></slot>
      </div>
      <div part="content">
        <slot></slot>
      </div>
      <div part="footer">
        <slot name="footer"></slot>
      </div>
    `;
  }

  /** @private */
  _mutationObserver;

  /** @private */
  _onMutation() {
    // Chrome doesn't support `:host(:has())`, so we'll recreate that with custom attributes
    this.toggleAttribute('has-media', this.querySelector(':scope > [slot="media"]'));
    this.toggleAttribute('has-header', this.querySelector(':scope > [slot="header"]'));
    this.toggleAttribute(
      'has-title',
      this.querySelector(':scope > [slot="title"]') && !this.querySelector(':scope > [slot="header"]'),
    );
    this.toggleAttribute(
      'has-subtitle',
      this.querySelector(':scope > [slot="subtitle"]') && !this.querySelector(':scope > [slot="header"]'),
    );
    this.toggleAttribute('has-header-prefix', this.querySelector(':scope > [slot="header-prefix"]'));
    this.toggleAttribute('has-header-suffix', this.querySelector(':scope > [slot="header-suffix"]'));
    this.toggleAttribute('has-content', this.querySelector(':scope > :not([slot])'));
    this.toggleAttribute('has-footer', this.querySelector(':scope > [slot="footer"]'));
  }

  connectedCallback() {
    super.connectedCallback();

    if (!CSS.supports('selector(:host(:has([slot])))')) {
      if (!this._mutationObserver) {
        this._mutationObserver = new MutationObserver(this._onMutation.bind(this));
      }
      this._mutationObserver.observe(this, { childList: 'true', attributeFilter: ['slot'], subtree: true });
      // Trigger once manually to update attributes on first render
      this._onMutation();
    }
  }

  disconnectedCallback() {
    if (this._mutationObserver) this._mutationObserver.disconnect();
    super.disconnectedCallback();
  }

  // TODO default role
  // TODO aria-describedby if header contains an H1-6 element
}

defineCustomElement(Card);

export { Card };
