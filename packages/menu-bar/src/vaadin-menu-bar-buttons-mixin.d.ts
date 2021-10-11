/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

declare function ButtonsMixin<T extends new (...args: any[]) => {}>(base: T): T & ButtonsMixinConstructor;

interface ButtonsMixinConstructor {
  new (...args: any[]): ButtonsMixin;
}

interface ButtonsMixin {
  readonly _buttons: HTMLElement[];

  readonly _container: HTMLElement;

  readonly _overflow: HTMLElement;

  _hasOverflow: boolean;
}

export { ButtonsMixin, ButtonsMixinConstructor };
