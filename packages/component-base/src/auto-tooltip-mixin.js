/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { AutoTooltipController } from './auto-tooltip-controller.js';

/**
 * A mixin that adds an `autoTooltip` property to a host component.
 * When enabled, a `<vaadin-tooltip>` is automatically created and slotted
 * into the host's `tooltip` slot, mirroring the host's visible text.
 *
 * Hosts opting in must:
 * - Import `@vaadin/tooltip` themselves — this mixin does not pull it in.
 * - Render a default `<slot>` as the text source and a `<slot name="tooltip">`.
 * - Visually hide the text source themselves (typically via the `sr-only`
 *   class) when `autoTooltip` is enabled — the mixin does not impose
 *   template structure.
 *
 * Override `_getAutoTooltipOptions()` to customize how the tooltip text is read.
 */
export const AutoTooltipMixin = (superClass) =>
  class AutoTooltipMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * When enabled, the host's visible text is mirrored into an
         * automatically created tooltip. The host is responsible for
         * visually hiding its text content.
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
    ready() {
      super.ready();

      this._tooltipController = new AutoTooltipController(this, this._getAutoTooltipOptions());
      this.addController(this._tooltipController);
      this._tooltipController.setEnabled(this.autoTooltip);
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('autoTooltip')) {
        this._tooltipController.setEnabled(this.autoTooltip);
      }
    }

    /**
     * Override to customize how the auto tooltip text is read.
     * Return an options object passed to `AutoTooltipController`.
     * Invoked once during `ready()`; the returned options are captured
     * for the lifetime of the host. For runtime branching, use a
     * `host`-aware `getText` callback.
     *
     * @protected
     */
    _getAutoTooltipOptions() {
      return undefined;
    }
  };
