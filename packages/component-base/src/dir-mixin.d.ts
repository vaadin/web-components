/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin to handle `dir` attribute based on the one set on the `<html>` element.
 *
 * @deprecated This mixin is deprecated and will be removed in Vaadin 26,
 * after which components will no longer set the `dir` attribute on themselves.
 * Use the `:dir(rtl)` CSS selector to style components in right-to-left mode,
 * and `element.matches(':dir(rtl)')` to detect it in JavaScript.
 */
export declare function DirMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<DirMixinClass> & T;

/**
 * @deprecated This mixin is deprecated and will be removed in Vaadin 26,
 * after which components will no longer set the `dir` attribute on themselves.
 * Use the `:dir(rtl)` CSS selector to style components in right-to-left mode,
 * and `element.matches(':dir(rtl)')` to detect it in JavaScript.
 */
export declare class DirMixinClass {
  /**
   * @deprecated Use `this.matches(':dir(rtl)')` instead.
   */
  protected readonly __isRTL: boolean;
}
