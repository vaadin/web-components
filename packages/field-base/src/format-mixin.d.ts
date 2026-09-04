/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { InputMixinClass } from './input-mixin.js';

/**
 * A mixin that provides the machinery for presenting the field value in another
 * form than the one stored in the `value` property.
 *
 * The mixin defines no format of its own. It owns the presentation write path
 * and the read-only `formattedValue` property, and exposes protected seams that
 * a layer above implements to decide when a reformat runs and what the presented
 * text is. Without such a layer `_hasFormat` stays `false`, `formattedValue`
 * stays empty, and the field behaves exactly as an unformatted one.
 *
 * Requires `InputControlMixin` (or a mixin applying it) below this mixin in the
 * chain. The `beforeinput`, `paste` and `drop` listeners are registered there;
 * without it, the delete intents and paste acceptance are inert and shrink
 * detection falls back to the view-length diff. Formatting on input still works.
 */
export declare function FormatMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<FormatMixinClass> & Constructor<InputMixinClass> & T;

export declare class FormatMixinClass {
  /**
   * Empty unless a format is configured. When one is, the value as presented in
   * the input element, with delimiters applied. Set `value` (the unformatted
   * model value) to change it; the `formatted-value` attribute is not a write
   * channel.
   */
  readonly formattedValue: string;

  /**
   * Returns true when a format is configured, which enables the presentation
   * write path and the live reformat. Override in a layer that presents the
   * value in another form than the model value.
   */
  protected readonly _hasFormat: boolean;

  /**
   * Returns true when a live reformat should run for this input event.
   * Override to format on commit instead of on input; the write site stays
   * reachable through `_presentValue`.
   */
  protected _shouldFormatOnInput(event: Event): boolean;

  /**
   * Presents the text entered in the input element in its formatted form.
   * The default implementation does nothing. Override in a layer that defines
   * a format, and write the result through `_presentValue`.
   */
  protected _formatOnInput(event: Event): void;

  /**
   * Writes presentation text to the input element.
   *
   * Pass `caret` to restore the caret to that index. Omit it to leave the caret
   * wherever writing the text puts it, which is what a formatter that only runs
   * on commit wants.
   */
  protected _presentValue(text: string, caret?: number): void;

  /**
   * Returns the caret index to restore after a presentation write that did not
   * come through `_presentValue`, or `undefined` to leave the caret alone.
   * The default implementation maps no caret. Override in a layer whose presented
   * text differs in length from the model value.
   */
  protected _mapCaretToPresentedValue(input: HTMLElement, text: string): number | undefined;

  protected _setFormattedValue(value: string): void;
}
