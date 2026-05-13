/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { screenReaderOnly } from '@vaadin/a11y-base/src/styles/sr-only-styles.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { isEmptyTextNode } from '@vaadin/component-base/src/dom-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
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
 * Name     | Description
 * ---------|-------------
 * (none)   | Default slot for the badge text content
 * `icon`   | Slot for an icon to place before the text
 * `tooltip` | Slot for a tooltip
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|-------------
 * `icon`     | The container for the icon slot
 * `number`   | The container for the number value
 * `content`  | The container for the default slot
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `has-icon`     | Set when the badge has content in the icon slot
 * `has-content`  | Set when the badge has content in the default slot
 * `has-number`   | Set when the badge has a number value
 * `has-tooltip`  | Set when the badge has a slotted tooltip
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property              |
 * :--------------------------------|
 * `--vaadin-badge-background`      |
 * `--vaadin-badge-border-color`    |
 * `--vaadin-badge-border-radius`   |
 * `--vaadin-badge-border-width`    |
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
 * @customElement vaadin-badge
 * @extends HTMLElement
 */
class Badge extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-badge';
  }

  static get styles() {
    return [badgeStyles, screenReaderOnly];
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get experimental() {
    return true;
  }

  static get properties() {
    return {
      /**
       * The number to display in the badge.
       */
      number: {
        type: Number,
      },

      /**
       * When enabled, hides the content visually and shows it in a tooltip.
       */
      autoTooltip: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    const theme = (this._theme || '').split(' ');
    const iconOnly = theme.includes('icon-only');
    const numberOnly = theme.includes('number-only');
    const dot = theme.includes('dot');

    return html`
      <div part="icon" class="${classMap({ 'sr-only': numberOnly || dot })}">
        <slot name="icon"></slot>
      </div>
      <div part="number" class="${classMap({ 'sr-only': iconOnly || dot })}">${this.number}</div>
      <div part="content" class="${classMap({ 'sr-only': numberOnly || iconOnly || dot || this.autoTooltip })}">
        <slot @slotchange="${this.__updateAutoTooltip}"></slot>
      </div>
      <slot name="tooltip" @slotchange="${this.__updateAutoTooltip}"></slot>
    `;
  }

  /** @protected */
  willUpdate(props) {
    super.willUpdate(props);

    if (props.has('number')) {
      this.toggleAttribute('has-number', this.number != null);
    }
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('autoTooltip')) {
      this.__updateAutoTooltip();
    }
  }

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
    this.__updateAutoTooltip();
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

  /** @private */
  __getContentText() {
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    return slot
      ? slot
          .assignedNodes({ flatten: true })
          .map((node) => node.textContent)
          .join('')
          .trim()
      : '';
  }

  /** @private */
  __hasCustomTooltip() {
    return Array.from(this.children).some((node) => node !== this.__autoTooltip && node.slot === 'tooltip');
  }

  /** @private */
  __updateAutoTooltip() {
    const text = this.__getContentText();

    if (!this.autoTooltip || !text || this.__hasCustomTooltip()) {
      this.__autoTooltip?.remove();
      return;
    }

    if (!this.__autoTooltip) {
      this.__autoTooltip = document.createElement('vaadin-tooltip');
      this.__autoTooltip.setAttribute('slot', 'tooltip');
    }

    this.__autoTooltip.setAttribute('text', text);

    if (!this.__autoTooltip.isConnected) {
      this.appendChild(this.__autoTooltip);
    }
  }
}

defineCustomElement(Badge);

export { Badge };
