/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { isEmptyTextNode } from '@vaadin/component-base/src/dom-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { badgeStyles } from './styles/vaadin-badge-base-styles.js';

/**
 * `<vaadin-badge>` is a Web Component for displaying badges.
 *
 * ```html
 * <vaadin-badge>New</vaadin-badge>
 * ```
 *
 * ### Slots
 *
 * Name   | Description
 * -------|-------------
 * (none) | Default slot for the badge text content
 * `icon` | Slot for an icon element (e.g. `<vaadin-icon>`)
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `has-icon`     | Set when the badge has an icon in the icon slot
 * `has-content`  | Set when the badge has content in the default slot
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property              |
 * :--------------------------------|
 * `--vaadin-badge-background`      |
 * `--vaadin-badge-border-radius`   |
 * `--vaadin-badge-font-size`       |
 * `--vaadin-badge-font-weight`     |
 * `--vaadin-badge-font-family`     |
 * `--vaadin-badge-gap`             |
 * `--vaadin-badge-line-height`     |
 * `--vaadin-badge-padding`         |
 * `--vaadin-badge-text-color`      |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Badge extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-badge';
  }

  static get styles() {
    return badgeStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get experimental() {
    return true;
  }

  /** @protected */
  render() {
    return html`<slot name="icon"></slot><slot></slot>`;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    const slot = this.shadowRoot.querySelector('slot:not([name])');
    this.__slotObserver = new SlotObserver(slot, ({ currentNodes }) => {
      this.toggleAttribute('has-content', currentNodes.filter((node) => !isEmptyTextNode(node)).length > 0);
    });

    const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
    this.__iconSlotObserver = new SlotObserver(iconSlot, ({ currentNodes }) => {
      this.toggleAttribute('has-icon', currentNodes.length > 0);
    });
  }
}

defineCustomElement(Badge);

export { Badge };
