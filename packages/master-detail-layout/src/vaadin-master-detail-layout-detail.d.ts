/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * A wrapper element for the detail content, to be used inside a
 * `<vaadin-master-detail-layout>`. Any content put inside this element will
 * automatically be shown in the detail area of the layout. If there is no
 * content, the detail area is hidden. In addition, whenever the contents
 * of this element change, the layout will automatically start a view transition
 * to animate between the old and new content.
 */
declare class MasterDetailLayoutDetail extends ElementMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-master-detail-layout-detail': MasterDetailLayoutDetail;
  }
}

export { MasterDetailLayoutDetail };
