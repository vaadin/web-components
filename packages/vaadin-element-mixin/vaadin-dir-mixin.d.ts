export { DirMixin };

declare function DirMixin<T extends new (...args: any[]) => {}>(base: T): T & DirMixinConstructor;

interface DirMixinConstructor {
  new (...args: any[]): DirMixin;

  finalize(): void;
}

export { DirMixinConstructor };

interface DirMixin {
  __getNormalizedScrollLeft(element: Element | null): number;

  __setNormalizedScrollLeft(element: Element | null, scrollLeft: number): void;
}
