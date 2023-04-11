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

/**
 * A mixin to handle `dir` attribute based on the one set on the `<html>` element.
 */
export declare function DirMixin<T extends Constructor<HTMLElement>>(base: T): T & Constructor<DirMixinClass>;

export declare class DirMixinClass {
  protected __getNormalizedScrollLeft(element: Element | null): number;

  protected __setNormalizedScrollLeft(element: Element | null, scrollLeft: number): void;
}
