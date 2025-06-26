/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { CSSInjectionMixin } from '@vaadin/vaadin-themable-mixin/css-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dashboardSectionStyles } from './styles/vaadin-dashboard-section-core-styles.js';
import { DashboardItemMixin } from './vaadin-dashboard-item-mixin.js';
import { getDefaultI18n } from './vaadin-dashboard-item-mixin.js';

/**
 * A section component for use with the Dashboard component
 *
 * ```html
 * <vaadin-dashboard-section section-title="Section Title">
 *   <vaadin-dashboard-widget widget-title="Widget 1"></vaadin-dashboard-widget>
 *   <vaadin-dashboard-widget widget-title="Widget 2"></vaadin-dashboard-widget>
 * </vaadin-dashboard-section>
 * ```
 *
 * #### Example
 *
 * ```html
 * <vaadin-dashboard-section section-title="Section title">
 *   <vaadin-dashboard-widget widget-title="Widget 1"></vaadin-dashboard-widget>
 *   <vaadin-dashboard-widget widget-title="Widget 2"></vaadin-dashboard-widget>
 * </vaadin-dashboard-section>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name              | Description
 * -----------------------|-------------
 * `header`               | The header of the section
 * `title`                | The title of the section
 * `move-button`          | The move button
 * `remove-button`        | The remove button
 * `move-backward-button` | The move backward button when in move mode
 * `move-forward-button`  | The move forward button when in move mode
 * `move-apply-button`    | The apply button when in move mode
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `selected`     | Set when the element is selected.
 * `focused`      | Set when the element is focused.
 * `move-mode`    | Set when the element is being moved.
 * `editable`     | Set when the element is editable.
 * `first-child`  | Set when the element is the first child of the parent.
 * `last-child`   | Set when the element is the last child of the parent.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes DashboardItemMixin
 */
class DashboardSection extends DashboardItemMixin(
  ElementMixin(ThemableMixin(CSSInjectionMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-dashboard-section';
  }

  static get styles() {
    return dashboardSectionStyles;
  }

  static get properties() {
    return {
      /**
       * The object used to localize this component.
       *
       * To change the default localization, replace the entire
       * `i18n` object with a custom one.
       *
       * The object has the following structure and default values:
       * ```
       * {
       *   selectSection: 'Select section for editing',
       *   remove: 'Remove',
       *   move: 'Move',
       *   moveApply: 'Apply',
       *   moveForward: 'Move Forward',
       *   moveBackward: 'Move Backward',
       * }
       * ```
       * @private
       */
      __i18n: {
        type: Object,
        value: () => {
          return getDefaultI18n();
        },
      },

      /**
       * The title of the section
       *
       * @attr {string} section-title
       * @type {string | null | undefined}
       */
      sectionTitle: {
        type: String,
        value: '',
      },

      /* @private */
      __rootHeadingLevel: {
        type: Number,
      },

      /** @private */
      __childCount: {
        type: Number,
        value: 0,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      ${this.__renderMoveControls()}

      <div id="focustrap">
        ${this.__renderFocusButton('selectSection')}

        <header part="header">
          ${this.__renderDragHandle()}
          <div id="title" role="heading" aria-level=${this.__rootHeadingLevel || 2} part="title"
            >${this.sectionTitle}</div
          >
          ${this.__renderRemoveButton()}
        </header>
      </div>

      <!-- Default slot is used by <vaadin-dashboard-layout> -->
      <slot></slot>
      <!-- Named slots are used by <vaadin-dashboard> -->
      ${[...Array(this.__childCount)].map((_, index) => html`<slot name="slot-${index}"></slot>`)}
    `;
  }

  /** @protected */
  ready() {
    super.ready();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'section');
    }
  }
}

defineCustomElement(DashboardSection);

export { DashboardSection };
