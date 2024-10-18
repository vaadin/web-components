/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-native-popover-overlay.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { PopoverPositionMixin } from '@vaadin/popover/src/vaadin-popover-position-mixin.js';
import { PopoverTargetMixin } from '@vaadin/popover/src/vaadin-popover-target-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Experimental component using native `popover`.
 */
class NativePopover extends PopoverPositionMixin(
  PopoverTargetMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-native-popover';
  }

  static get properties() {
    return {
      /**
       * True if the popover overlay is opened, false otherwise.
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
      },

      /**
       * Set to true to disable closing popover overlay on outside click.
       *
       * @attr {boolean} no-close-on-outside-click
       */
      noCloseOnOutsideClick: {
        type: Boolean,
        value: false,
      },

      /**
       * Set to true to disable closing popover overlay on Escape press.
       *
       * @attr {boolean} no-close-on-esc
       */
      noCloseOnEsc: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        display: contents;
      }

      #overlay::part(content) {
        overflow: visible;
      }

      /* Increase the area so the pointer can go from the target directly to the popover. */
      #overlay::part(overlay)::before {
        position: absolute;
        content: '';
        inset-block: calc(var(--vaadin-popover-offset-top, 0) * -1) calc(var(--vaadin-popover-offset-bottom, 0) * -1);
        inset-inline: calc(var(--vaadin-popover-offset-start, 0) * -1) calc(var(--vaadin-popover-offset-end, 0) * -1);
        z-index: -1;
      }

      #overlay:is([position^='top'][top-aligned], [position^='bottom'][top-aligned])::part(overlay) {
        margin-top: var(--vaadin-popover-offset-top, 0);
      }

      #overlay:is([position^='top'][bottom-aligned], [position^='bottom'][bottom-aligned])::part(overlay) {
        margin-bottom: var(--vaadin-popover-offset-bottom, 0);
      }

      #overlay:is([position^='start'][start-aligned], [position^='end'][start-aligned])::part(overlay) {
        margin-inline-start: var(--vaadin-popover-offset-start, 0);
      }

      #overlay:is([position^='start'][end-aligned], [position^='end'][end-aligned])::part(overlay) {
        margin-inline-end: var(--vaadin-popover-offset-end, 0);
      }
    `;
  }

  static get observers() {
    return ['__openedOrTargetChanged(opened, target)'];
  }

  constructor() {
    super();

    this.__onTargetClick = this.__onTargetClick.bind(this);
  }

  /** @protected */
  render() {
    const position = this.__effectivePosition;

    return html`
      <vaadin-native-popover-overlay
        id="overlay"
        .opened="${this.opened}"
        .positionTarget="${this.target}"
        .noCloseOnEsc="${this.noCloseOnEsc}"
        .noCloseOnOutsideClick="${this.noCloseOnOutsideClick}"
        ?no-horizontal-overlap="${this.__computeNoHorizontalOverlap(position)}"
        ?no-vertical-overlap="${this.__computeNoVerticalOverlap(position)}"
        .horizontalAlign="${this.__computeHorizontalAlign(position)}"
        .verticalAlign="${this.__computeVerticalAlign(position)}"
        position="${position}"
        @opened-changed="${this.__onOpenedChanged}"
        exportparts="overlay, content"
      >
        <slot></slot>
      </vaadin-native-popover-overlay>
    `;
  }

  /**
   * @param {HTMLElement} target
   * @protected
   * @override
   */
  _addTargetListeners(target) {
    target.addEventListener('click', this.__onTargetClick);
  }

  /**
   * @param {HTMLElement} target
   * @protected
   * @override
   */
  _removeTargetListeners(target) {
    target.removeEventListener('click', this.__onTargetClick);
  }

  /** @private */
  __openedOrTargetChanged(opened, target) {
    if (target) {
      target.setAttribute('aria-expanded', opened ? 'true' : 'false');
    }
  }

  /**
   * Native popover closes on outside click and there is no way to prevent this
   * by cancelling `beforetoggle`, see https://github.com/whatwg/html/issues/8973
   * So we set `popover="manual"` and a custom global listener to handle closing.
   * @private
   */
  __onGlobalClick(event) {
    if (
      this.opened &&
      !event.composedPath().some((el) => el === this.__popoverRef.value || el === this.target) &&
      !this.noCloseOnOutsideClick
    ) {
      this.opened = false;
    }
  }

  /**
   * Native popover closes on Escape press and there is no way to prevent this
   * by cancelling `beforetoggle`, see https://github.com/whatwg/html/issues/8973
   * So we set `popover="manual"` and a custom global listener to handle closing.
   * @private
   */
  __onGlobalKeyDown(event) {
    if (event.key === 'Escape' && this.opened && !this.noCloseOnEsc) {
      // Prevent closing parent overlay (e.g. dialog)
      event.stopPropagation();
      this.opened = false;
    }
  }

  /** @private */
  __onTargetClick() {
    this.opened = !this.opened;
  }

  /** @private */
  __onOpenedChanged(event) {
    this.opened = event.detail.value;
  }
}

defineCustomElement(NativePopover);

export { NativePopover };
