/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { DelegateStateMixin } from '@vaadin/component-base/src/delegate-state-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CollapsibleMixin } from './collapsible-mixin.js';

/**
 * Fired when the `opened` property changes.
 */
export type DetailsOpenedChangedEvent = CustomEvent<{ value: boolean }>;

export interface DetailsCustomEventMap {
  'opened-changed': DetailsOpenedChangedEvent;
}

export type DetailsEventMap = DetailsCustomEventMap & HTMLElementEventMap;

/**
 * `<vaadin-details>` is a Web Component which the creates an
 * expandable panel similar to `<details>` HTML element.
 *
 * ```
 * <vaadin-details>
 *   <vaadin-details-summary slot="summary">Expandable Details</vaadin-details-summary>
 *   <div>
 *     Toggle using mouse, Enter and Space keys.
 *   </div>
 * </vaadin-details>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name        | Description
 * -----------------|----------------
 * `content`        | The wrapper for the collapsible details content.
 *
 * The following attributes are exposed for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `opened`     | Set when the collapsible content is expanded and visible.
 * `disabled`   | Set when the element is disabled.
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class Details extends CollapsibleMixin(
  DelegateStateMixin(DelegateFocusMixin(ElementMixin(ThemableMixin(ControllerMixin(HTMLElement))))),
) {
  /**
   * A text that is displayed in the summary, if no
   * element is assigned to the `summary` slot.
   */
  summary: string | null | undefined;

  addEventListener<K extends keyof DetailsEventMap>(
    type: K,
    listener: (this: Details, ev: DetailsEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DetailsEventMap>(
    type: K,
    listener: (this: Details, ev: DetailsEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-details': Details;
  }
}

export { Details };
