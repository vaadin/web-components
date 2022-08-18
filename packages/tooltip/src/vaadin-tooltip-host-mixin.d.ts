/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';

/**
 * A mixin enabling a web component to act as a tooltip host.
 * Any components that extend this mixin are required to import
 * the `vaadin-tooltip` web component using the correct theme.
 */
export declare function TooltipHostMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> & Constructor<TooltipHostMixinClass> & T;

export declare class TooltipHostMixinClass {
  /**
   * An HTML element to attach the tooltip to.
   * Defaults to the the web component itself.
   * Override to use another element instead.
   */
  protected _tooltipTarget: HTMLElement;
}
