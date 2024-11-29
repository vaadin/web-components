/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
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
import { css, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { SYNCHRONIZED_ATTRIBUTES, WRAPPER_LOCAL_NAME } from './vaadin-dashboard-helpers.js';
import { DashboardItemMixin } from './vaadin-dashboard-item-mixin.js';
import { getDefaultI18n } from './vaadin-dashboard-item-mixin.js';

/**
 * A Widget component for use with the Dashboard component
 *
 * ```html
 * <vaadin-dashboard-widget widget-title="Title">
 *   <span slot="header-content">Header</span>
 *   <div>Content</div>
 * </vaadin-dashboard-widget>
 * ```
 *
 * ### Customization
 *
 * You can configure the item by using `slot` names.
 *
 * Slot name        | Description
 * -----------------|-------------
 * `header-content` | A slot for the widget header content.
 *
 * #### Example
 *
 * ```html
 * <vaadin-dashboard-widget widget-title="Title">
 *   <span slot="header-content">Header</span>
 *   <div>Content</div>
 * </vaadin-dashboard-widget>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name                     | Description
 * ------------------------------|-------------
 * `header`                      | The header of the widget
 * `title`                       | The title of the widget
 * `content`                     | The content of the widget
 * `move-button`                 | The move button
 * `remove-button`               | The remove button
 * `resize-button`               | The resize button
 * `move-backward-button`        | The move backward button when in move mode
 * `move-forward-button`         | The move forward button when in move mode
 * `move-apply-button`           | The apply button when in move mode
 * `resize-shrink-width-button`  | The shrink width button when in resize mode
 * `resize-grow-width-button`    | The grow width button when in resize mode
 * `resize-shrink-height-button` | The shrink height button when in resize mode
 * `resize-grow-height-button`   | The grow height button when in resize mode
 * `resize-apply-button`         | The apply button when in resize mode
 *
 * The following custom properties are available:
 *
 * Custom Property                   | Description
 * ----------------------------------|-------------
 * `--vaadin-dashboard-item-colspan` | colspan of the widget
 * `--vaadin-dashboard-item-rowspan` | rowspan of the widget
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `selected`     | Set when the element is selected.
 * `focused`      | Set when the element is focused.
 * `move-mode`    | Set when the element is being moved.
 * `resize-mode`  | Set when the element is being resized.
 * `resizing`     | Set when the element is being resized.
 * `dragging`     | Set when the element is being dragged.
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
class DashboardWidget extends DashboardItemMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-dashboard-widget';
  }

  static get experimental() {
    return 'dashboardComponent';
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          grid-column: var(--_vaadin-dashboard-item-column);
          grid-row: var(--_vaadin-dashboard-item-row);
          position: relative;
        }

        :host([hidden]) {
          display: none !important;
        }

        :host(:not([editable])) [part~='resize-button'] {
          display: none;
        }

        [part~='content'] {
          flex: 1;
          overflow: hidden;
        }

        [part~='resize-button'] {
          position: absolute;
          bottom: 0;
          inset-inline-end: 0;
          z-index: 1;
          overflow: hidden;
        }

        :host([resizing])::after {
          content: '';
          z-index: 2;
          position: absolute;
          top: -1px;
          width: var(--_vaadin-dashboard-widget-resizer-width, 0);
          height: var(--_vaadin-dashboard-widget-resizer-height, 0);
          background: rgba(0, 0, 0, 0.1);
          border-radius: inherit;
        }
      `,
      super.styles,
    ];
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
       *   selectWidget: 'Select widget for editing',
       *   remove: 'Remove',
       *   resize: 'Resize',
       *   resizeApply: 'Apply',
       *   resizeShrinkWidth: 'Shrink width',
       *   resizeGrowWidth: 'Grow width',
       *   resizeShrinkHeight: 'Shrink height',
       *   resizeGrowHeight: 'Grow height',
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
          const i18n = getDefaultI18n();
          delete i18n.selectSection;
          return i18n;
        },
      },

      /**
       * The title of the widget.
       *
       * @attr {string} widget-title
       * @type {string | null | undefined}
       */
      widgetTitle: {
        type: String,
        value: '',
        observer: '__onWidgetTitleChanged',
      },

      /* @private */
      __nestedHeadingLevel: {
        type: Boolean,
        value: false,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      ${this.__renderMoveControls()} ${this.__renderResizeControls()}

      <div id="focustrap">
        ${this.__renderFocusButton('selectWidget')}

        <header part="header">
          ${this.__renderDragHandle()}
          ${this.__nestedHeadingLevel
            ? html`<h3 id="title" part="title" .hidden=${!this.widgetTitle}>${this.widgetTitle}</h3>`
            : html`<h2 id="title" part="title" .hidden=${!this.widgetTitle}>${this.widgetTitle}</h2>`}
          <slot name="header-content"></slot>
          ${this.__renderRemoveButton()}
        </header>

        ${this.__renderResizeHandle()}
      </div>

      <div id="content" part="content">
        <slot></slot>
      </div>
    `;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    const wrapper = this.closest(WRAPPER_LOCAL_NAME);
    if (wrapper) {
      SYNCHRONIZED_ATTRIBUTES.forEach((attr) => {
        this.toggleAttribute(attr, !!wrapper[attr]);
      });
      this.__i18n = wrapper.i18n;
    }

    const undefinedAncestor = this.closest('*:not(:defined)');
    if (undefinedAncestor) {
      customElements.whenDefined(undefinedAncestor.localName).then(() => queueMicrotask(() => this.__updateTitle()));
    } else {
      this.__updateTitle();
    }
  }

  /** @protected */
  ready() {
    super.ready();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'article');
    }
  }

  /** @private */
  __onWidgetTitleChanged() {
    this.__updateTitle();
  }

  /** @private */
  __updateTitle() {
    const titleLevel = getComputedStyle(this).getPropertyValue('--_vaadin-dashboard-title-level');
    this.__nestedHeadingLevel = titleLevel === '3';
  }
}

defineCustomElement(DashboardWidget);

export { DashboardWidget };
