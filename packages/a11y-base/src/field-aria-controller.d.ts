/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller for managing ARIA attributes for a field element:
 * either the component itself or slotted `<input>` element.
 */
export class FieldAriaController {
  /**
   * The controller host element.
   */
  host: HTMLElement;

  constructor(host: HTMLElement);

  /**
   * Sets a target element to which ARIA attributes are added.
   */
  setTarget(target: HTMLElement): void;

  /**
   * Toggles the `aria-required` attribute on the target element
   * if the target is the host component (e.g. a field group).
   * Otherwise, it does nothing.
   */
  setRequired(required: boolean): void;

  /**
   * Defines the `aria-label` attribute of the target element.
   *
   * To remove the attribute, pass `null` as `label`.
   */
  setLabel(label: string | null): void;

  /**
   * Links the target element to one or more elements via the `aria-labelledby` attribute.
   *
   * Pass a space-delimited list of IDs, or `null` to remove the previously linked IDs.
   */
  setLabelledBy(labelledBy: string | null): void;

  /**
   * Links the target element to one or more elements via the `aria-describedby` attribute.
   *
   * @param describedBy the space-delimited list of IDs,
   * or `null` to remove the previously linked IDs
   */
  setDescribedBy(describedBy: string | null): void;

  /**
   * Links the target element to a slotted error element via the `aria-describedby` attribute.
   *
   * Pass the ID of the error element, or `null` to remove the previously linked ID.
   */
  setErrorId(errorId: string | null): void;

  /**
   * Links the target element to a slotted helper element via the `aria-describedby` attribute.
   *
   * Pass the ID of the helper element, or `null` to remove the previously linked ID.
   */
  setHelperId(helperId: string | null): void;
}
