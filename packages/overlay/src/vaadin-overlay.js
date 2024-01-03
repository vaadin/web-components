/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { OverlayMixin } from './vaadin-overlay-mixin.js';
import { overlayStyles } from './vaadin-overlay-styles.js';

registerStyles('vaadin-overlay', overlayStyles, { moduleId: 'vaadin-overlay-styles' });

/**
 * `<vaadin-overlay>` is a Web Component for creating overlays. The content of the overlay
 * can be populated imperatively by using `renderer` callback function.
 *
 * ### Rendering
 *
 * The renderer function provides `root`, `owner`, `model` arguments when applicable.
 * Generate DOM content by using `model` object properties if needed, append it to the `root`
 * element and control the state of the host element by accessing `owner`. Before generating new
 * content, users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-overlay id="overlay"></vaadin-overlay>
 * ```
 * ```js
 * const overlay = document.querySelector('#overlay');
 * overlay.renderer = function(root) {
 *  root.textContent = "Overlay content";
 * };
 * ```
 *
 * Renderer is called on the opening of the overlay and each time the related model is updated.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### Styling
 *
 * The following Shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|---------------------------------------------------------|
 * `backdrop` | Backdrop of the overlay
 * `overlay`  | Container for position/sizing/alignment of the content
 * `content`  | Content of the overlay
 *
 * The following state attributes are available for styling:
 *
 * Attribute | Description | Part
 * ---|---|---
 * `opening` | Applied just after the overlay is attached to the DOM. You can apply a CSS @keyframe animation for this state. | `:host`
 * `closing` | Applied just before the overlay is detached from the DOM. You can apply a CSS @keyframe animation for this state. | `:host`
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property | Description | Default value
 * ---|---|---
 * `--vaadin-overlay-viewport-bottom` | Bottom offset of the visible viewport area | `0` or detected offset
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} vaadin-overlay-open - Fired after the overlay is opened.
 * @fires {CustomEvent} vaadin-overlay-close - Fired when the opened overlay is about to be closed. Calling `preventDefault()` on the event cancels the closing.
 * @fires {CustomEvent} vaadin-overlay-closing - Fired when the overlay starts to close. Closing the overlay can be asynchronous depending on the animation.
 * @fires {CustomEvent} vaadin-overlay-closed - Fired after the overlay is closed.
 * @fires {CustomEvent} vaadin-overlay-outside-click - Fired before the overlay is closed on outside click. Calling `preventDefault()` on the event cancels the closing.
 * @fires {CustomEvent} vaadin-overlay-escape-press - Fired before the overlay is closed on Escape key press. Calling `preventDefault()` on the event cancels the closing.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DirMixin
 * @mixes OverlayMixin
 */
class Overlay extends OverlayMixin(ThemableMixin(DirMixin(PolymerElement))) {
  static get template() {
    return html`
      <div id="backdrop" part="backdrop" hidden$="[[!withBackdrop]]"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-overlay';
  }

  /** @protected */
  ready() {
    super.ready();

    processTemplates(this);
  }

  /**
   * @event vaadin-overlay-open
   * Fired after the overlay is opened.
   */

  /**
   * @event vaadin-overlay-close
   * Fired when the opened overlay is about to be closed.
   * Calling `preventDefault()` on the event cancels the closing.
   */

  /**
   * @event vaadin-overlay-closing
   * Fired when the overlay starts to close.
   * Closing the overlay can be asynchronous depending on the animation.
   */

  /**
   * @event vaadin-overlay-closed
   * Fired after the overlay is closed.
   */

  /**
   * @event vaadin-overlay-escape-press
   * Fired before the overlay is closed on Escape key press.
   * Calling `preventDefault()` on the event cancels the closing.
   */

  /**
   * @event vaadin-overlay-outside-click
   * Fired before the overlay is closed on outside click.
   * Calling `preventDefault()` on the event cancels the closing.
   */
}

defineCustomElement(Overlay);

export { Overlay };
