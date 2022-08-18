/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { TooltipController } from './vaadin-tooltip-controller.js';

/**
 * A mixin enabling a web component to act as a tooltip host.
 * Any components that extend this mixin are required to import
 * the `vaadin-tooltip` web component using the correct theme.
 *
 * @polymerMixin
 */
export const TooltipHostMixin = (superClass) =>
  class TooltipHostMixinClass extends ControllerMixin(superClass) {
    static get properties() {
      return {
        /**
         * An HTML element to attach the tooltip to.
         * Defaults to the the web component itself.
         * Override to use another element instead.
         * @protected
         */
        _tooltipTarget: {
          type: Object,
          observer: '__tooltipTargetChanged',
        },
      };
    }

    constructor() {
      super();

      this._tooltipTarget = this;
      this._tooltipController = new TooltipController(this);
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(this._tooltipController);
    }

    /** @private */
    __tooltipTargetChanged(target, oldTarget) {
      if (target || oldTarget) {
        this._tooltipController.setTarget(target);
      }
    }
  };
