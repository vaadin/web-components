/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * `backdrop`     | Backdrop covering the master area in the overlay mode
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
 * `overlay`      | Set when the layout is using the overlay mode.
 * `stack`        | Set when the layout is using the stack mode.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class MasterDetailLayout extends SlotStylesMixin(ResizeMixin(ThemableMixin(ElementMixin(HTMLElement)))) {
  /**
   * Fixed size (in CSS length units) to be set on the detail area.
   * When specified, it prevents the detail area from growing or
   * shrinking. If there is not enough space to show master and detail
   * areas next to each other, the layout switches to the overlay mode.
   *
   * @attr {string} detail-size
   */
  detailSize: string | null | undefined;

  /**
   * Minimum size (in CSS length units) to be set on the detail area.
   * When specified, it prevents the detail area from shrinking below
   * this size. If there is not enough space to show master and detail
   * areas next to each other, the layout switches to the overlay mode.
   *
   * @attr {string} detail-min-size
   */
  detailMinSize: string | null | undefined;

  /**
   * Fixed size (in CSS length units) to be set on the master area.
   * When specified, it prevents the master area from growing or
   * shrinking. If there is not enough space to show master and detail
   * areas next to each other, the layout switches to the overlay mode.
   *
   * @attr {string} master-size
   */
  masterSize: string | null | undefined;

  /**
   * Minimum size (in CSS length units) to be set on the master area.
   * When specified, it prevents the master area from shrinking below
   * this size. If there is not enough space to show master and detail
   * areas next to each other, the layout switches to the overlay mode.
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
   * When specified, forces the layout to use overlay mode, even if
   * there is enough space for master and detail to be shown next to
   * each other using the default (split) mode.
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
   * The threshold (in CSS length units) at which the layout switches to
   * the "stack" mode, making detail area fully cover the master area.
   *
   * @attr {string} stack-threshold
   */
  stackThreshold: string | null | undefined;

  /**
   * When true, the layout does not use animated transitions for the detail area.
   *
   * @attr {boolean} no-animation
   */
  noAnimation: boolean;

  /**
   * Sets the detail element to be displayed in the detail area and starts a
   * view transition that animates adding, replacing or removing the detail
   * area. During the view transition, the element is added to the DOM and
   * assigned to the `detail` slot. Any previous detail element is removed.
   * When passing null as the element, the current detail element is removed.
   *
   * If the browser does not support view transitions, the respective updates
   * are applied immediately without starting a transition.
   */
  protected _setDetail(detail: HTMLElement | null): Promise<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-master-detail-layout': MasterDetailLayout;
  }
}

export { MasterDetailLayout };
