/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export declare function ButtonsMixin<T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<ButtonsMixinClass> & Constructor<ResizeMixinClass>;

export declare class ButtonsMixinClass {
  protected readonly _buttons: HTMLElement[];

  protected readonly _container: HTMLElement;

  protected readonly _overflow: HTMLElement;

  protected _hasOverflow: boolean;
}
