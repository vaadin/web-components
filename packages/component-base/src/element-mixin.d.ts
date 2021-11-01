/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ReactiveControllerHost } from 'lit';
import '../custom_typings/vaadin-usage-statistics.js';
import '../custom_typings/vaadin.js';
import { DirHost } from './dir-mixin.js';

export declare class ElementHost {
  static version: string;

  protected static finalize(): void;
}

/**
 * A mixin to provide common logic for Vaadin components.
 */
export declare function ElementMixin<T extends Constructor<HTMLElement>>(
  superclass: T
): T &
  Constructor<ElementHost> &
  Pick<typeof ElementHost, keyof typeof ElementHost> &
  Constructor<DirHost> &
  Pick<typeof DirHost, keyof typeof DirHost> &
  Pick<ReactiveControllerHost, 'addController' | 'removeController'>;
