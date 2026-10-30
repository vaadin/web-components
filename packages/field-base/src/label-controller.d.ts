/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotContentController } from '@vaadin/component-base/src/slot-content-controller.js';

/**
 * A controller to manage the label element.
 */
export class LabelController extends SlotContentController {
  constructor(host: HTMLElement);

  /**
   * String used for the label.
   */
  protected label: string | null | undefined;

  /**
   * Set label based on corresponding host property.
   */
  setLabel(label: string | null | undefined): void;

  /**
   * Override method from `SlotContentController` to create the default label element.
   */
  protected createDefault(): HTMLLabelElement;

  /**
   * Override method from `SlotContentController` to show the label text
   * in the default label element. A custom label keeps its own content.
   */
  protected updateNode(node: Node): void;
}
