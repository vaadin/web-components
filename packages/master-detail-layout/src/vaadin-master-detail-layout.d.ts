/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
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
 * Part name             | Description
 * ----------------------|----------------------
 * `backdrop`            | Backdrop covering the master area in the overlay mode
 * `master`              | The master area
 * `detail`              | The detail area
 * `detail-placeholder`  | The detail placeholder area
 *
 * The following state attributes are available for styling:
 *
 * Attribute             | Description
 * ----------------------|----------------------
 * `expand`              | Set to `master`, `detail`, or `both`.
 * `orientation`         | Set to `horizontal` or `vertical` depending on the orientation.
 * `has-detail`          | Set when the detail content is provided and visible.
 * `overlay`             | Set when columns don't fit and the detail is shown as an overlay.
 * `overlay-containment` | Set to `layout` or `viewport`.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                  |
 * :----------------------------------------------------|
 * | `--vaadin-master-detail-layout-border-color`       |
 * | `--vaadin-master-detail-layout-border-width`       |
 * | `--vaadin-master-detail-layout-detail-background`  |
 * | `--vaadin-master-detail-layout-detail-shadow`      |
 * | `--vaadin-overlay-backdrop-background`             |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} backdrop-click - Fired when the user clicks the backdrop in the overlay mode.
 * @fires {CustomEvent} detail-escape-press - Fired when the user presses Escape in the detail area.
 */
declare class MasterDetailLayout extends ThemableMixin(ElementMixin(HTMLElement)) {
  /**
   * Size (in CSS length units) to be set on the detail area in
   * the CSS grid layout. If there is not enough space to show
   * master and detail areas next to each other, the detail area
   * is shown as an overlay. Defaults to 15em.
   *
   * @attr {string} detail-size
   */
  detailSize: string | null | undefined;

  /**
   * Size (in CSS length units) to be set on the master area in
   * the CSS grid layout. If there is not enough space to show
   * master and detail areas next to each other, the detail area
   * is shown as an overlay. Defaults to 30em.
   *
   * @attr {string} master-size
   */
  masterSize: string | null | undefined;

  /**
   * Size (in CSS length units) for the detail area when shown as an
   * overlay. When not set, falls back to `detailSize`. Set to `100%`
   * to make the detail cover the full layout.
   *
   * @attr {string} overlay-size
   */
  overlaySize: string | null | undefined;

  /**
   * Define how master and detail areas are shown next to each other,
   * and the way how size and min-size properties are applied to them.
   * Possible values are: `horizontal` or `vertical`.
   * Defaults to horizontal.
   */
  orientation: 'horizontal' | 'vertical';

  /**
   * Defines the containment of the detail area when the layout is in
   * overlay mode. When set to `layout`, the overlay is confined to the
   * layout. When set to `viewport`, the overlay is confined to the
   * browser's viewport. Defaults to `layout`.
   *
   * @attr {string} overlay-containment
   */
  overlayContainment: 'layout' | 'viewport';

  /**
   * Controls which column(s) expand to fill available space.
   * Possible values: `'master'`, `'detail'`, `'both'`.
   * Defaults to `'both'`.
   */
  expand: 'master' | 'detail' | 'both';

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
