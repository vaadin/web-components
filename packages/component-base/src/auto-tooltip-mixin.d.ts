/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { AutoTooltipController, AutoTooltipControllerOptions } from './auto-tooltip-controller.js';

export declare function AutoTooltipMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<AutoTooltipMixinClass> & T;

export declare class AutoTooltipMixinClass {
  /**
   * When enabled, the host's visible text is mirrored into an
   * automatically created tooltip. The host is responsible for
   * visually hiding its text content.
   */
  autoTooltip: boolean;

  protected _tooltipController: AutoTooltipController;

  /**
   * Override to customize how the auto tooltip text is read.
   * Return an options object passed to `AutoTooltipController`.
   * Invoked once during `ready()`; the returned options are captured
   * for the lifetime of the host.
   */
  protected _getAutoTooltipOptions(): AutoTooltipControllerOptions | undefined;
}
