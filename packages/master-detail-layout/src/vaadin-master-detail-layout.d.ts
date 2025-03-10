/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-master-detail-layout>` is a web component for building UIs with a master
 * (or primary) area and a detail (or secondary) area that is displayed next to, or
 * overlaid on top of, the master area, depending on configuration and viewport size.
 */
declare class MasterDetailLayout extends ThemableMixin(ElementMixin(HTMLElement)) {
  /**
   * Fixed size (in CSS length units) to be set on the detail pane.
   * When specified, it prevents the detail pane from growing.
   *
   * @attr {string} detail-size
   */
  detailSize: string | null | undefined;

  /**
   * Minimum size (in CSS length units) to be set on the detail pane.
   *
   * @attr {string} detail-min-size
   */
  detailMinSize: string | null | undefined;

  /**
   * Fixed size (in CSS length units) to be set on the master pane.
   * When specified, it prevents the master pane from growing.
   *
   * @attr {string} master-size
   */
  masterSize: string | null | undefined;

  /**
   * Minimum size (in CSS length units) to be set on the master pane.
   *
   * @attr {string} master-min-size
   */
  masterMinSize: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-master-detail-layout': MasterDetailLayout;
  }
}

export { MasterDetailLayout };
