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
    this.setAttribute('slot', 'detail-hidden');
    this.__previousChildren = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.__layout = this.closest('vaadin-master-detail-layout');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__layout = null;
  }

  /** @protected */
  render() {
    return html` <slot @slotchange="${this.__onSlotChange}"></slot>`;
  }

  /** @private */
  async __onSlotChange(e) {
    const supportViewTransitions = typeof document.startViewTransition === 'function';
    const nextChildren = e.target.assignedNodes();
    const hasNextChildren = nextChildren.length > 0;
    const hasPreviousChildren = this.__previousChildren.length > 0;

    const updateSlot = () => {
      if (hasNextChildren) {
        this.setAttribute('slot', 'detail');
      } else {
        this.setAttribute('slot', 'detail-hidden');
      }

      if (this.__layout) {
        this.__layout.__updateDetailSlot();
      }
      this.__previousChildren = nextChildren;
    };

    if (!this.__layout || this.__layout.noAnimation || !supportViewTransitions || this.__transitioning) {
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
