/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DetailsMixin } from '@vaadin/details/src/vaadin-details-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { DelegateStateMixin } from '@vaadin/field-base/src/delegate-state-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Fired when the `opened` property changes.
 */
export type AccordionPanelOpenedChangedEvent = CustomEvent<{ value: boolean }>;

export interface AccordionPanelCustomEventMap {
  'opened-changed': AccordionPanelOpenedChangedEvent;
}

export type AccordionPanelEventMap = AccordionPanelCustomEventMap & HTMLElementEventMap;

/**
 * The accordion panel element.
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name        | Description
 * -----------------|----------------
 * `content`        | The wrapper for the collapsible panel content.
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
declare class AccordionPanel extends DetailsMixin(DelegateFocusMixin(DelegateStateMixin(ThemableMixin(HTMLElement)))) {
  addEventListener<K extends keyof AccordionPanelEventMap>(
    type: K,
    listener: (this: AccordionPanel, ev: AccordionPanelEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof AccordionPanelEventMap>(
    type: K,
    listener: (this: AccordionPanel, ev: AccordionPanelEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-accordion-panel': AccordionPanel;
  }
}

export { AccordionPanel };
