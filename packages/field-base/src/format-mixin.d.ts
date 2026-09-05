/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { InputMixinClass } from './input-mixin.js';

/**
 * The text of an input element and the selection in it.
 */
export interface FormatState {
  value: string;
  selection: [number, number];
}

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
 * While a format is configured, the mixin also reports an edit that a layer
 * applied from script rather than letting the browser apply it: on blur it
 * dispatches `change` when the text in the input element differs from the text
 * the focus session started with, since the browser fires no `change` of its own
 * for such an edit.
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
   * The text of the input element and the selection in it as they were before
   * the edit that is being handled, which is what an edit is reconstructed
   * against. Refreshed on `beforeinput`, on focus, and after every write the
   * mixin makes, so that inside `_formatOnInput` it describes the state that
   * the edit started from rather than its outcome.
   *
   * The value is a copy, so changing it does not affect the field.
   */
  protected readonly _prevState: FormatState;

  /**
   * Returns true when a live reformat should run for this input event.
   * Override to format on commit instead of on input; the write site stays
   * reachable through `_presentValue`.
   */
  protected _shouldFormatOnInput(event: Event): boolean;

  /**
   * Returns true when a live reformat should also run for an edit that removes
   * characters. The default implementation returns false, which leaves the text
   * that the deletion produced as it is.
   *
   * Override in a layer whose presentation is positional, where the characters
   * that a deletion leaves behind no longer line up with the presentation and
   * have to be laid out again.
   */
  protected _shouldFormatOnDelete(event: Event): boolean;

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
   * on commit wants. Either way the caret is left alone when no format is
   * configured.
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
