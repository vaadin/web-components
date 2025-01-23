/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/polymer-flag.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { useLitComponents } from '@vaadin/component-base/src/lit-flag.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { buttonStyles, buttonTemplate } from './vaadin-button-base.js';
import { ButtonMixin } from './vaadin-button-mixin.js';

if (!useLitComponents) {
  registerStyles('vaadin-button', buttonStyles, { moduleId: 'vaadin-button-styles' });
}

/**
 * Polymer based version of `<vaadin-button>` web component.
 */
class Button extends ButtonMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement)))) {
  static get properties() {
    return {
      /**
       * When disabled, the button is rendered as "dimmed" and prevents all
       * user interactions (mouse and keyboard).
       *
       * Since disabled buttons are not focusable and cannot react to hover
       * events by default, it can cause accessibility issues by making them
       * entirely invisible to assistive technologies, and prevents the use
       * of Tooltips to explain why the action is not available. This can be
       * addressed by enabling the feature flag `accessibleDisabledButtons`,
       * which makes disabled buttons focusable and hoverable, while still
       * preventing them from being triggered:
       *
       * ```
       * // Set before any button is attached to the DOM.
       * window.Vaadin.featureFlags.accessibleDisabledButtons = true
       * ```
       */
      disabled: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get is() {
    return 'vaadin-button';
  }

  static get template() {
    return buttonTemplate(html);
  }

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }

  /** @override */
  __shouldAllowFocusWhenDisabled() {
    return window.Vaadin.featureFlags.accessibleDisabledButtons;
  }
}

if (!useLitComponents) {
  defineCustomElement(Button);
}

export { Button };
