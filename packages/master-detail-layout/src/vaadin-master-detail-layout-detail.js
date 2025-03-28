/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

/**
 * A wrapper element for the detail content, to be used inside a
 * `<vaadin-master-detail-layout>`. Any content put inside this element will
 * automatically be shown in the detail area of the layout. If there is no
 * content, the detail area is hidden. In addition, whenever the contents
 * of this element change, the layout will automatically start a view transition
 * to animate between the old and new content.
 */
class MasterDetailLayoutDetail extends ElementMixin(LitElement) {
  static get is() {
    return 'vaadin-master-detail-layout-detail';
  }

  static get styles() {
    return css`
      :host {
        display: contents;
      }
    `;
  }

  constructor() {
    super();
    this.__previousChildren = [];
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__updateSlotName();
    this.__layout = this.closest('vaadin-master-detail-layout');
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__layout = null;
  }

  /** @protected */
  render() {
    return html` <slot @slotchange="${this.__onSlotChange}"></slot>`;
  }

  /** @private */
  __updateSlotName() {
    const hasChildren = this.children.length > 0;
    const slotName = hasChildren ? 'detail' : 'detail-hidden';
    this.setAttribute('slot', slotName);
  }

  /** @private */
  async __onSlotChange() {
    const supportViewTransitions = typeof document.startViewTransition === 'function';
    const nextChildren = Array.from(this.children);
    const hasNextChildren = nextChildren.length > 0;
    const hasPreviousChildren = this.__previousChildren.length > 0;
    const noChange = !hasNextChildren && !hasPreviousChildren;

    const updateSlot = () => {
      this.__updateSlotName();
      this.__previousChildren = nextChildren;
      if (this.__layout) {
        this.__layout.__updateDetailSlot();
      }
    };

    if (!this.__layout || noChange || this.__layout.noAnimation || !supportViewTransitions || this.__transitioning) {
      updateSlot();
      return;
    }

    this.__transitioning = true;

    // Restore previous DOM state before starting transition
    nextChildren.forEach((child) => this.removeChild(child));
    this.__previousChildren.forEach((child) => this.appendChild(child));

    // Start view transition
    const transitionType = hasPreviousChildren && hasNextChildren ? 'replace' : hasPreviousChildren ? 'remove' : 'add';
    this.__layout.setAttribute('transition', transitionType);
    const transition = document.startViewTransition(() => {
      // Redo DOM changes and update slot
      nextChildren.forEach((child) => this.appendChild(child));
      this.__previousChildren.forEach((child) => this.removeChild(child));
      updateSlot();
    });
    await transition.finished;
    this.__layout.removeAttribute('transition');
    this.__transitioning = false;
  }
}

defineCustomElement(MasterDetailLayoutDetail);
