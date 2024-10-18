/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayPositionManager } from './vaadin-overlay-position-manager.js';
import { PositionPropertiesMixin } from './vaadin-overlay-position-properties-mixin.js';

/**
 * @polymerMixin
 */
export const PositionMixin = (superClass) =>
  class PositionMixin extends PositionPropertiesMixin(superClass) {
    static get observers() {
      return [
        '__positionSettingsChanged(horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap, requiredVerticalSpace)',
        '__overlayOpenedChanged(opened, positionTarget)',
      ];
    }

    constructor() {
      super();

      this._manager = new OverlayPositionManager(this);
    }

    /** @private */
    __overlayOpenedChanged(opened, target) {
      this._manager.setState({ opened, target });
    }

    /** @private */
    __positionSettingsChanged(
      horizontalAlign,
      verticalAlign,
      noHorizontalOverlap,
      noVerticalOverlap,
      requiredVerticalSpace,
    ) {
      this._manager.setState({
        horizontalAlign,
        verticalAlign,
        noHorizontalOverlap,
        noVerticalOverlap,
        requiredVerticalSpace,
      });
    }
  };
