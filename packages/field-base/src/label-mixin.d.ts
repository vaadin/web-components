/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { SlotHost } from '@vaadin/component-base/src/slot-mixin.js';

export declare class LabelHost {
  /**
   * String used for a label element.
   */
  label: string | null | undefined;

  protected readonly _labelNode: HTMLLabelElement;

  protected _labelChanged(label: string | null | undefined): void;

  protected _toggleHasLabelAttribute(): void;
}

/**
 * A mixin to provide label via corresponding property or named slot.
 */
export declare function LabelMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<LabelHost> &
  Pick<typeof LabelHost, keyof typeof LabelHost> &
  Constructor<SlotHost> &
  Pick<typeof SlotHost, keyof typeof SlotHost> &
  Pick<typeof HTMLElement, keyof typeof HTMLElement>;
