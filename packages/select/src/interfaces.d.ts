import { SelectElement } from './vaadin-select';

/**
 * Function for rendering the content of the `<vaadin-select>`.
 * Receives two arguments:
 *
 * - `root` The `<vaadin-select-overlay>` internal container
 *   DOM element. Append your content to it.
 * - `select` The reference to the `<vaadin-select>` element.
 */
export type SelectRenderer = (root: HTMLElement, select?: SelectElement) => void;

/**
 * Fired when the `opened` property changes.
 */
export type SelectOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type SelectInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type SelectValueChangedEvent = CustomEvent<{ value: string }>;

export interface SelectElementEventMap {
  'opened-changed': SelectOpenedChangedEvent;

  'invalid-changed': SelectInvalidChangedEvent;

  'value-changed': SelectValueChangedEvent;
}

export interface SelectEventMap extends HTMLElementEventMap, SelectElementEventMap {}
