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

export declare function ButtonsMixin<T extends Constructor<HTMLElement>>(base: T): T & Constructor<ButtonsMixinClass>;

export declare class ButtonsMixinClass {
  protected readonly _buttons: HTMLElement[];

  protected readonly _container: HTMLElement;

  protected readonly _overflow: HTMLElement;

  protected _hasOverflow: boolean;
}
