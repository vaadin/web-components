/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { DialogBaseMixin } from './vaadin-dialog-base-mixin.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
import { DialogRendererMixin } from './vaadin-dialog-renderer-mixin.js';
import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';

/**
 * LitElement based version of `<vaadin-dialog>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment not intended for publishing to npm.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
declare class Dialog extends DialogDraggableMixin(
  DialogResizableMixin(
    DialogRendererMixin(DialogBaseMixin(OverlayClassMixin(ThemePropertyMixin(ElementMixin(HTMLElement))))),
  ),
) {
  /**
   * Set the `aria-label` attribute for assistive technologies like
   * screen readers. An empty string value for this property (the
   * default) means that the `aria-label` attribute is not present.
   */
  ariaLabel: string;
}

export { Dialog };
