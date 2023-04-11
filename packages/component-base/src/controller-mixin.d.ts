/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * A mixin for connecting controllers to the element.
 */
export declare function ControllerMixin<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<ControllerMixinClass>;

export declare class ControllerMixinClass
  implements Pick<ReactiveControllerHost, 'addController' | 'removeController'>
{
  /**
   * Registers a controller to participate in the element update cycle.
   */
  addController(controller: ReactiveController): void;

  /**
   * Removes a controller from the element.
   */
  removeController(controller: ReactiveController): void;
}
