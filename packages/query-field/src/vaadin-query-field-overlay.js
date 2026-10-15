/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';

/**
 * An element used internally by `<vaadin-query-field>`. Not intended to be used separately.
 *
 * @customElement vaadin-query-field-overlay
 * @extends HTMLElement
 * @private
 */
class QueryFieldOverlay extends PositionMixin(OverlayMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-query-field-overlay';
  }

  /**
   * Override method from `OverlayFocusMixin` to opt out of focus management,
   * focus always stays in the input of the query field.
   * @protected
   * @override
   */
  static get manageFocus() {
    return false;
  }

  static get styles() {
    return [
      overlayStyles,
      css`
        [part='overlay'] {
          min-width: var(--vaadin-query-field-overlay-min-width, 12em);
        }

        [part='content'] {
          padding: var(--vaadin-item-overlay-padding, 4px);
          max-height: var(--vaadin-query-field-overlay-max-height, 65vh);
        }

        :host([top-aligned]) [part='overlay'] {
          margin-top: var(--_offset, 4px);
        }

        :host([bottom-aligned]) [part='overlay'] {
          margin-bottom: var(--_offset, 4px);
        }
      `,
    ];
  }

  constructor() {
    super();

    this.requiredVerticalSpace = 200;
  }

  /** @protected */
  render() {
    return html`
      <div part="overlay" id="overlay">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }
}

defineCustomElement(QueryFieldOverlay);

export { QueryFieldOverlay };
