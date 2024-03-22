/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin to handle `dir` attribute based on the one set on the `<html>` element.
 */
export declare function DirMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<DirMixinClass> & T;

export declare class DirMixinClass {
  protected __getNormalizedScrollLeft(element: Element | null): number;

  protected __setNormalizedScrollLeft(element: Element | null, scrollLeft: number): void;
}
