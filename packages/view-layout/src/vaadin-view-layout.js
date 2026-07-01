/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/scroller/src/vaadin-scroller.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { viewLayoutStyles } from './styles/vaadin-view-layout-base-styles.js';
import { TitleController } from './title-controller.js';

/**
 * `<vaadin-view-layout>` is a web component that provides a structured layout for a view,
 * with a header (prefix, title, suffix), scrollable content, and a footer.
 *
 * ```html
 * <vaadin-view-layout header-title="Bookings">
 *   <vaadin-grid></vaadin-grid>
 * </vaadin-view-layout>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `header`  | The container for the header prefix, title, header, and header suffix slots.
 * `content` | The scrollable container for the default (content) slot.
 * `footer`  | The container for the footer slot.
 *
 * The following state attributes are set based on the presence of slotted content:
 *
 * Attribute           | Description
 * --------------------|-------------
 * `has-title`         | Set when a `[slot="title"]` child is present.
 * `has-header`        | Set when a `[slot="header"]` child is present.
 * `has-header-prefix` | Set when a `[slot="header-prefix"]` child is present.
 * `has-header-suffix` | Set when a `[slot="header-suffix"]` child is present.
 * `has-footer`        | Set when a `[slot="footer"]` child is present.
 *
 * @customElement
 * @extends HTMLElement
 */
class ViewLayout extends ElementMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-view-layout';
  }

  static get experimental() {
    return 'viewLayoutComponent';
  }

  static get styles() {
    return viewLayoutStyles;
  }

  static get properties() {
    return {
      /**
       * The title of the view. When set, an internal title element is rendered
       * in the light DOM using `<div role="heading" aria-level="N">`. A consumer
       * supplied `[slot="title"]` element takes precedence over this property.
       *
       * @attr {string} header-title
       */
      headerTitle: {
        type: String,
      },

      /**
       * Sets the heading level (`aria-level`) for the string-based title. Defaults to 2.
       * Setting values outside the range [1, 6] can cause accessibility issues.
       *
       * @attr {number} title-heading-level
       */
      titleHeadingLevel: {
        type: Number,
        value: 2,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div part="header">
        <slot name="header-prefix"></slot>
        <slot name="title"></slot>
        <slot name="header"></slot>
        <slot name="header-suffix"></slot>
      </div>

      <vaadin-scroller part="content">
        <slot></slot>
      </vaadin-scroller>

      <div part="footer">
        <slot name="footer"></slot>
      </div>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    this.__titleController = new TitleController(this);
    this.addController(this.__titleController);

    this._onSlotChange();
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('headerTitle')) {
      this.__titleController.setTitle(this.headerTitle);
    }

    if (props.has('titleHeadingLevel')) {
      this.__titleController.setLevel(this.titleHeadingLevel);
    }
  }

  /**
   * @protected
   * @override
   */
  createRenderRoot() {
    const root = super.createRenderRoot();
    root.addEventListener('slotchange', () => this._onSlotChange());
    return root;
  }

  /** @private */
  _onSlotChange() {
    this.toggleAttribute('has-header', !!this.querySelector(':scope > [slot="header"]'));
    this.toggleAttribute('has-header-prefix', !!this.querySelector(':scope > [slot="header-prefix"]'));
    this.toggleAttribute('has-header-suffix', !!this.querySelector(':scope > [slot="header-suffix"]'));
    this.toggleAttribute('has-footer', !!this.querySelector(':scope > [slot="footer"]'));
    this.toggleAttribute('has-title', !!this.querySelector(':scope > [slot="title"]'));
  }
}

defineCustomElement(ViewLayout);

export { ViewLayout };
