import { LitElement } from 'lit';

declare type Constructor<T> = new (...args: any[]) => T;

declare function PolylitMixin<T extends Constructor<LitElement>>(base: T): T & PolylitMixinConstructor;

interface PolylitMixinConstructor {
  new (...args: any[]): PolylitMixin;
}

interface PolylitMixin {
  ready(): void;
}

export { PolylitMixin, PolylitMixinConstructor };
