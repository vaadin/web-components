/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ShadowFocusMixin } from '@vaadin/field-base/src/shadow-focus-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 *   <div slot="summary">Expandable Details</div>
 *   Toggle using mouse, Enter and Space keys.
 * </vaadin-details>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name        | Description
 * -----------------|----------------
 * `summary`        | The element used to open and close collapsible content.
 * `toggle`         | The element used as indicator, can represent an icon.
 * `summary-content`| The wrapper for the slotted summary content.
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
declare class Details extends ShadowFocusMixin(ElementMixin(ThemableMixin(ControllerMixin(HTMLElement)))) {
  /**
   * If true, the details content is visible.
   */
  opened: boolean;

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
