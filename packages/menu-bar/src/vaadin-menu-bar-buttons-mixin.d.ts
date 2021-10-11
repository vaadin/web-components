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
