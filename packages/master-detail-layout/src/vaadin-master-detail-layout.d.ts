/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-master-detail-layout>` is a web component for building UIs with a master
 * (or primary) area and a detail (or secondary) area that is displayed next to, or
 * overlaid on top of, the master area, depending on configuration and viewport size.
 */
declare class MasterDetailLayout extends ResizeMixin(ThemableMixin(ElementMixin(HTMLElement))) {
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
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-master-detail-layout': MasterDetailLayout;
  }
}

export { MasterDetailLayout };
