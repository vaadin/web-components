/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { userTagsOverlayStyles } from './vaadin-field-highlighter-styles.js';

registerStyles('vaadin-user-tags-overlay', [overlayStyles, userTagsOverlayStyles]);

/**
 * An element used internally by `<vaadin-field-highlighter>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes PositionMixin
 * @mixes OverlayMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @private
 */
class UserTagsOverlay extends PositionMixin(OverlayMixin(DirMixin(ThemableMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-user-tags-overlay';
  }

  static get template() {
    return html`
      <div id="backdrop" part="backdrop" hidden$="[[!withBackdrop]]"></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

defineCustomElement(UserTagsOverlay);
