/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * A mixin for connecting controllers to the element.
 */
export declare function ControllerMixin<T extends Constructor<HTMLElement>>(
  superclass: T,
): Constructor<ControllerMixinClass> & T;

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
