/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement, nothing } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverflowController } from '@vaadin/component-base/src/overflow-controller.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { panelStyles } from './styles/vaadin-panel-base-styles.js';
import { TitleController } from './title-controller.js';

/**
 * `<vaadin-panel>` is a layout for a view, with a header, a scrollable content area
 * and a footer. The default ARIA role is `region`, labelled by the title.
 *
 * ```html
 * <vaadin-panel header-title="Edit User">
 *   <vaadin-button slot="header-prefix" theme="tertiary" aria-label="Close">×</vaadin-button>
 *   <vaadin-button slot="header-suffix" theme="tertiary">Cancel</vaadin-button>
 *   <vaadin-button slot="header-suffix" theme="primary">Save</vaadin-button>
 *   <form>...</form>
 *   <vaadin-button slot="footer">Delete</vaadin-button>
 * </vaadin-panel>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `header`  | The container for the header prefix, title and header suffix.
 * `content` | The scrollable container for the content.
 * `footer`  | The container for the footer elements.
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description
 * --------------------|-------------
 * `has-title`         | Set when the panel has a title.
 * `has-header-prefix` | Set when the panel has a header prefix.
 * `has-header-suffix` | Set when the panel has header suffix elements.
 * `has-footer`        | Set when the panel has footer elements.
 * `overflow`          | Set to `top`, `bottom`, `start`, `end`, all of them, or none, when the content overflows.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property        |
 * :--------------------------|
 * | `--vaadin-panel-gap`     |
 * | `--vaadin-panel-padding` |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-panel
 * @extends HTMLElement
 */
class Panel extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  /** @type {TitleController} */
  #titleController;

  static get is() {
    return 'vaadin-panel';
  }

  static get experimental() {
    return true;
  }

  static get styles() {
    return panelStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get properties() {
    return {
      /**
       * The title of the panel. When set, a heading element is rendered in the
       * `title` slot. A custom slotted title takes precedence over this property.
       *
       * @attr {string} header-title
       */
      headerTitle: {
        type: String,
      },

      /**
       * The heading level (`aria-level`) of the generated title. Defaults to 2.
       * Setting values outside the range [1, 6] can cause accessibility issues.
       *
       * @attr {number} heading-level
       */
      headingLevel: {
        type: Number,
        value: 2,
      },

      /** @private */
      __overflow: {
        type: String,
        attribute: 'overflow',
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div part="header">
        <slot name="header-prefix"></slot>
        <div id="title"><slot name="title"></slot></div>
        <div id="suffix"><slot name="header-suffix"></slot></div>
      </div>
      <div part="content" id="content" tabindex="${this.__overflow ? 0 : nothing}">
        <slot></slot>
      </div>
      <div part="footer">
        <slot name="footer"></slot>
      </div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region');
    }

    this.#titleController = new TitleController(this);
    this.addController(this.#titleController);

    // The controller writes the `overflow` attribute read by `__overflow`.
    this.addController(new OverflowController(this, this.$.content));

    this.#onSlotChange();
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('headerTitle')) {
      this.#titleController.setTitle(this.headerTitle);
    }

    if (props.has('headingLevel')) {
      this.#titleController.setLevel(this.headingLevel);
    }
  }

  /**
   * Override method from `LitElement` to update the state attributes on `slotchange`.
   *
   * @protected
   * @override
   */
  createRenderRoot() {
    const root = super.createRenderRoot();
    root.addEventListener('slotchange', () => this.#onSlotChange());
    return root;
  }

  #onSlotChange() {
    this.toggleAttribute('has-title', !!this.querySelector(':scope > [slot="title"]'));
    this.toggleAttribute('has-header-prefix', !!this.querySelector(':scope > [slot="header-prefix"]'));
    this.toggleAttribute('has-header-suffix', !!this.querySelector(':scope > [slot="header-suffix"]'));
    this.toggleAttribute('has-footer', !!this.querySelector(':scope > [slot="footer"]'));
  }
}

defineCustomElement(Panel);

export { Panel };
