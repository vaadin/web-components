/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to handle `dir` attribute based on the one set on the `<html>` element.
 */
declare function DirMixin<T extends new (...args: any[]) => {}>(base: T): T & DirMixinConstructor;

interface DirMixinConstructor {
  new (...args: any[]): DirMixin;

  finalize(): void;
}

interface DirMixin {
  __getNormalizedScrollLeft(element: Element | null): number;

  __setNormalizedScrollLeft(element: Element | null, scrollLeft: number): void;
}

export { DirMixin, DirMixinConstructor };
