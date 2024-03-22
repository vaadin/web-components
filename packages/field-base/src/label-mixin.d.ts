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
import type { LabelController } from './label-controller.js';

/**
 * A mixin to provide label via corresponding property or named slot.
 */
export declare function LabelMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<LabelMixinClass> & T;

export declare class LabelMixinClass {
  /**
   * String used for a label element.
   */
  label: string | null | undefined;

  protected readonly _labelNode: HTMLLabelElement;

  protected _labelController: LabelController;

  protected _labelChanged(label: string | null | undefined): void;
}
