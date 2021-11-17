/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ReactiveControllerHost } from 'lit';

/**
 * A mixin to provide common logic for Vaadin components.
 */
export declare function ControllerMixin<T extends Constructor<HTMLElement>>(
  superclass: T
): T & Constructor<ControllerMixinClass> & Pick<ReactiveControllerHost, 'addController' | 'removeController'>;

export declare class ControllerMixinClass {}
