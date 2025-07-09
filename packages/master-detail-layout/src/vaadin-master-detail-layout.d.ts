/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export interface MasterDetailLayoutCustomEventMap {
  'backdrop-click': Event;

  'detail-escape-press': Event;
}

export interface MasterDetailLayoutEventMap extends HTMLElementEventMap, MasterDetailLayoutCustomEventMap {}

/**
 * `<vaadin-master-detail-layout>` is a web component for building UIs with a master
 * (or primary) area and a detail (or secondary) area that is displayed next to, or
 * overlaid on top of, the master area, depending on configuration and viewport size.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name      | Description
 * ---------------|----------------------
 * `backdrop`     | Backdrop covering the master area in the drawer mode
 * `master`       | The master area
 * `detail`       | The detail area
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------| -----------
 * `containment`  | Set to `layout` or `viewport` depending on the containment.
 * `orientation`  | Set to `horizontal` or `vertical` depending on the orientation.
 * `has-detail`   | Set when the detail content is provided.
 * `drawer`       | Set when the layout is using the drawer mode.
 * `stack`        | Set when the layout is using the stack mode.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} backdrop-click - Fired when the user clicks the backdrop in the drawer mode.
 * @fires {CustomEvent} detail-escape-press - Fired when the user presses Escape in the detail area.
 */
declare class MasterDetailLayout extends SlotStylesMixin(ResizeMixin(ThemableMixin(ElementMixin(HTMLElement)))) {
  /**
   * Fixed size (in CSS length units) to be set on the detail area.
   * When specified, it prevents the detail area from growing or
   * shrinking. If there is not enough space to show master and detail
   * areas next to each other, the details are shown as an overlay:
   * either as drawer or stack, depending on the `stackOverlay` property.
   *
   * @attr {string} detail-size
   */
  detailSize: string | null | undefined;

  /**
   * Minimum size (in CSS length units) to be set on the detail area.
   * When specified, it prevents the detail area from shrinking below
   * this size. If there is not enough space to show master and detail
   * areas next to each other, the details are shown as an overlay:
   * either as drawer or stack, depending on the `stackOverlay` property.
   *
   * @attr {string} detail-min-size
   */
  detailMinSize: string | null | undefined;

  /**
   * Fixed size (in CSS length units) to be set on the master area.
   * When specified, it prevents the master area from growing or
   * shrinking. If there is not enough space to show master and detail
   * areas next to each other, the details are shown as an overlay:
   * either as drawer or stack, depending on the `stackOverlay` property.
   *
   * @attr {string} master-size
   */
  masterSize: string | null | undefined;

  /**
   * Minimum size (in CSS length units) to be set on the master area.
   * When specified, it prevents the master area from shrinking below
   * this size. If there is not enough space to show master and detail
   * areas next to each other, the details are shown as an overlay:
   * either as drawer or stack, depending on the `stackOverlay` property.
   *
   * @attr {string} master-min-size
   */
  masterMinSize: string | null | undefined;

  /**
   * Define how master and detail areas are shown next to each other,
   * and the way how size and min-size properties are applied to them.
   * Possible values are: `horizontal` or `vertical`.
   * Defaults to horizontal.
   */
  orientation: 'horizontal' | 'vertical';

  /**
   * When specified, forces the details to be shown as an overlay
   * (either as drawer or stack), even if there is enough space for
   * master and detail to be shown next to each other using the default
   * (split) mode.
   *
   * In order to enforce the stack mode, use this property together with
   * `stackOverlay` property and set both to `true`.
   *
   * @attr {boolean} force-overlay
   */
  forceOverlay: boolean;

  /**
   * Defines the containment of the detail area when the layout is in
   * overlay mode. When set to `layout`, the overlay is confined to the
   * layout. When set to `viewport`, the overlay is confined to the
   * browser's viewport. Defaults to `layout`.
   */
  containment: 'layout' | 'viewport';

  /**
   * When true, the layout in the overlay mode is rendered as a stack,
   * making detail area fully cover the master area. Otherwise, it is
   * rendered as a drawer and has a visual backdrop.
   *
   * In order to enforce the stack mode, use this property together with
   * `forceOverlay` property and set both to `true`.
   *
   * @attr {string} stack-threshold
   */
  stackOverlay: boolean;

  /**
   * When true, the layout does not use animated transitions for the detail area.
   *
   * @attr {boolean} no-animation
   */
  noAnimation: boolean;

  addEventListener<K extends keyof MasterDetailLayoutEventMap>(
    type: K,
    listener: (this: MasterDetailLayout, ev: MasterDetailLayoutEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof MasterDetailLayoutEventMap>(
    type: K,
    listener: (this: MasterDetailLayout, ev: MasterDetailLayoutEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-master-detail-layout': MasterDetailLayout;
  }
}

export { MasterDetailLayout };
