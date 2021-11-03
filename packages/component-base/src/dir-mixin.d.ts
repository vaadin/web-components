/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin to handle `dir` attribute based on the one set on the `<html>` element.
 */
export declare function DirMixin<T extends Constructor<HTMLElement>>(base: T): T & Constructor<DirMixinClass>;

export declare class DirMixinClass {
  protected __getNormalizedScrollLeft(element: Element | null): number;

  protected __setNormalizedScrollLeft(element: Element | null, scrollLeft: number): void;
}
