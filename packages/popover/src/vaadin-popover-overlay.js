/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { popoverOverlayStyles } from './styles/vaadin-popover-overlay-base-styles.js';
import { PopoverOverlayMixin } from './vaadin-popover-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-popover>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes PopoverOverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class PopoverOverlay extends PopoverOverlayMixin(
  DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-popover-overlay';
  }

  static get styles() {
    return popoverOverlayStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" hidden ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <div part="arrow"></div>
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('restoreFocusNode') && this.opened) {
      // Save focus to be restored when target is set while opened
      if (this.restoreFocusNode && isElementFocused(this.restoreFocusNode.focusElement || this.restoreFocusNode)) {
        this.__focusRestorationController.saveFocus();
      } else if (!this.restoreFocusNode) {
        // Do not restore focus when target is cleared while opened
        this.__focusRestorationController.focusNode = null;
      }
    }
  }

  /**
   * @override
   * @protected
   */
  get _contentRoot() {
    return this.owner;
  }

  /**
   * @override
   * @protected
   */
  get _rendererRoot() {
    return this.owner;
  }

  /**
   * Override method from OverlayFocusMixin to use owner as focus trap root
   * @protected
   * @override
   */
  get _focusTrapRoot() {
    return this.owner;
  }

  /**
   * Override method from `OverlayMixin` to always add outside
   * click listener so that it can be used by modeless popover.
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldAddGlobalListeners() {
    return true;
  }

  /**
   * Override method from `OverlayMixin` to prevent closing when clicking on target.
   * Clicking the target will already close the popover when using the click trigger.
   *
   * @override
   * @protected
   */
  _shouldCloseOnOutsideClick(event) {
    if (event.composedPath().includes(this.positionTarget)) {
      return false;
    }
    return super._shouldCloseOnOutsideClick(event);
  }
}

defineCustomElement(PopoverOverlay);
