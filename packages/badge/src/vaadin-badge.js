/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
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
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute | Description
 * ----------|-------------
 * `empty`   | Set when the badge has no text content or child elements
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
 * `--vaadin-badge-line-height`     |
 * `--vaadin-badge-min-width`       |
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

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @protected */
  ready() {
    super.ready();

    const slot = this.shadowRoot.querySelector('slot');
    this.__slotObserver = new SlotObserver(
      slot,
      ({ currentNodes }) => {
        const isEmpty = currentNodes.filter((node) => !isEmptyTextNode(node)).length === 0;
        this.toggleAttribute('empty', isEmpty);
      },
      true,
    );
  }
}

defineCustomElement(Badge);

export { Badge };
