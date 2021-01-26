/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';

registerStyles(
  'vaadin-dialog-overlay',
  css`
    /*
      NOTE(platosha): Make some min-width to prevent collapsing of the content
      taking the parent width, e. g., <vaadin-grid> and such.
    */
    [part='content'] {
      min-width: 12em; /* matches the default <vaadin-text-field> width */
    }

    :host([has-bounds-set]) [part='overlay'] {
      max-width: none;
    }
  `,
  { moduleId: 'vaadin-dialog-overlay-styles' }
);

let memoizedTemplate;

/**
 * The overlay element.
 *
 * ### Styling
 *
 * See [`<vaadin-overlay>` documentation](https://github.com/vaadin/vaadin-overlay/blob/master/src/vaadin-overlay.html)
 * for `<vaadin-dialog-overlay>` parts.
 *
 * @private
 */
class DialogOverlayElement extends mixinBehaviors(IronResizableBehavior, OverlayElement) {
  static get is() {
    return 'vaadin-dialog-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      const contentPart = memoizedTemplate.content.querySelector('[part="content"]');
      const overlayPart = memoizedTemplate.content.querySelector('[part="overlay"]');
      const resizerContainer = document.createElement('div');
      resizerContainer.id = 'resizerContainer';
      resizerContainer.classList.add('resizer-container');
      resizerContainer.appendChild(contentPart);
      overlayPart.appendChild(resizerContainer);
    }
    return memoizedTemplate;
  }

  static get properties() {
    return {
      modeless: Boolean,

      withBackdrop: Boolean
    };
  }

  /**
   * Updates the coordinates of the overlay.
   * @param {!DialogOverlayBoundsParam} bounds
   */
  setBounds(bounds) {
    const overlay = this.$.overlay;
    const parsedBounds = Object.assign({}, bounds);

    if (overlay.style.position !== 'absolute') {
      overlay.style.position = 'absolute';
      this.setAttribute('has-bounds-set', '');
      this.__forceSafariReflow();
    }

    for (const arg in parsedBounds) {
      if (typeof parsedBounds[arg] === 'number') {
        parsedBounds[arg] = `${parsedBounds[arg]}px`;
      }
    }

    Object.assign(overlay.style, parsedBounds);
  }

  /**
   * Retrieves the coordinates of the overlay.
   * @return {!DialogOverlayBounds}
   */
  getBounds() {
    const overlayBounds = this.$.overlay.getBoundingClientRect();
    const containerBounds = this.getBoundingClientRect();
    const top = overlayBounds.top - containerBounds.top;
    const left = overlayBounds.left - containerBounds.left;
    const width = overlayBounds.width;
    const height = overlayBounds.height;
    return { top, left, width, height };
  }

  /**
   * Safari 13 renders overflowing elements incorrectly.
   * This forces it to recalculate height.
   * @private
   */
  __forceSafariReflow() {
    const scrollPosition = this.$.resizerContainer.scrollTop;
    const overlay = this.$.overlay;
    overlay.style.display = 'block';

    requestAnimationFrame(() => {
      overlay.style.display = '';
      this.$.resizerContainer.scrollTop = scrollPosition;
    });
  }
}

customElements.define(DialogOverlayElement.is, DialogOverlayElement);

/**
 * `<vaadin-dialog>` is a Web Component for creating customized modal dialogs. The content of the
 * dialog can be populated in two ways: imperatively by using renderer callback function and
 * declaratively by using Polymer's Templates.
 *
 * ### Rendering
 *
 * By default, the dialog uses the content provided by using the renderer callback function.
 *
 * The renderer function provides `root`, `dialog` arguments.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `dialog`. Before generating new content,
 * users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-dialog id="dialog"></vaadin-dialog>
 * ```
 * ```js
 * const dialog = document.querySelector('#dialog');
 * dialog.renderer = function(root, dialog) {
 *   root.textContent = "Sample dialog";
 * };
 * ```
 *
 * Renderer is called on the opening of the dialog.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### Polymer Templates
 *
 * Alternatively, the content can be provided with Polymer's Template.
 * Dialog finds the first child template and uses that in case renderer callback function
 * is not provided. You can also set a custom template using the `template` property.
 *
 * ```html
 * <vaadin-dialog opened>
 *   <template>
 *     Sample dialog
 *   </template>
 * </vaadin-dialog>
 * ```
 *
 * ### Styling
 *
 * See [`<vaadin-overlay>` documentation](https://github.com/vaadin/vaadin-overlay/blob/master/src/vaadin-overlay.html)
 * for `<vaadin-dialog-overlay>` parts.
 *
 * Note: the `theme` attribute value set on `<vaadin-dialog>` is
 * propagated to the internal `<vaadin-dialog-overlay>` component.
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @fires {CustomEvent} resize - Fired when the dialog resize is finished.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemePropertyMixin
 * @mixes ElementMixin
 * @mixes DialogDraggableMixin
 * @mixes DialogResizableMixin
 */
class DialogElement extends ThemePropertyMixin(
  ElementMixin(DialogDraggableMixin(DialogResizableMixin(PolymerElement)))
) {
  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>

      <vaadin-dialog-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-mousedown="_bringOverlayToFront"
        on-touchstart="_bringOverlayToFront"
        theme$="[[theme]]"
        modeless="[[modeless]]"
        with-backdrop="[[!modeless]]"
        resizable$="[[resizable]]"
        focus-trap
      ></vaadin-dialog-overlay>
    `;
  }

  static get is() {
    return 'vaadin-dialog';
  }

  static get version() {
    return '3.0.0-alpha1';
  }

  static get properties() {
    return {
      /**
       * True if the overlay is currently displayed.
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true
      },

      /**
       * Set to true to disable closing dialog on outside click
       * @attr {boolean} no-close-on-outside-click
       * @type {boolean}
       */
      noCloseOnOutsideClick: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to disable closing dialog on Escape press
       * @attr {boolean} no-close-on-esc
       * @type {boolean}
       */
      noCloseOnEsc: {
        type: Boolean,
        value: false
      },

      /**
       * Set the `aria-label` attribute for assistive technologies like
       * screen readers. An `undefined` value for this property (the
       * default) means that the `aria-label` attribute is not present at
       * all.
       */
      ariaLabel: {
        type: String
      },

      /**
       * @type {HTMLTemplateElement | undefined}
       * @protected
       */
      _contentTemplate: Object,

      /**
       * Custom function for rendering the content of the dialog.
       * Receives two arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `dialog` The reference to the `<vaadin-dialog>` element.
       * @type {DialogRenderer | undefined}
       */
      renderer: Function,

      /**
       * Set to true to remove backdrop and allow click events on background elements.
       * @type {boolean}
       */
      modeless: {
        type: Boolean,
        value: false
      },

      /** @private */
      _oldTemplate: Object,

      /** @private */
      _oldRenderer: Object
    };
  }

  static get observers() {
    return [
      '_openedChanged(opened)',
      '_ariaLabelChanged(ariaLabel)',
      '_templateOrRendererChanged(_contentTemplate, renderer)'
    ];
  }

  /** @protected */
  ready() {
    super.ready();
    this.$.overlay.setAttribute('role', 'dialog');
    this.$.overlay.addEventListener('vaadin-overlay-outside-click', this._handleOutsideClick.bind(this));
    this.$.overlay.addEventListener('vaadin-overlay-escape-press', this._handleEscPress.bind(this));

    this._observer = new FlattenedNodesObserver(this, (info) => {
      this._setTemplateFromNodes(info.addedNodes);
    });
  }

  /**
   * @param {!Array<!Node>} nodes
   * @protected
   */
  _setTemplateFromNodes(nodes) {
    this._contentTemplate =
      nodes.filter((node) => node.localName && node.localName === 'template')[0] || this._contentTemplate;
  }

  /** @private */
  _removeNewRendererOrTemplate(template, oldTemplate, renderer, oldRenderer) {
    if (template !== oldTemplate) {
      this._contentTemplate = undefined;
    } else if (renderer !== oldRenderer) {
      this.renderer = undefined;
    }
  }

  /**
   * Manually invoke existing renderer.
   */
  render() {
    this.$.overlay.render();
  }

  /** @private */
  _templateOrRendererChanged(template, renderer) {
    if (template && renderer) {
      this._removeNewRendererOrTemplate(template, this._oldTemplate, renderer, this._oldRenderer);
      throw new Error('You should only use either a renderer or a template for dialog content');
    }

    this._oldTemplate = template;
    this._oldRenderer = renderer;

    if (renderer) {
      this.$.overlay.setProperties({ owner: this, renderer: renderer });
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.opened = false;
  }

  /** @private */
  _openedChanged(opened) {
    if (opened) {
      this.$.overlay.template = this.querySelector('template');
    }
    this.$.overlay.opened = opened;
  }

  /** @private */
  _ariaLabelChanged(ariaLabel) {
    if (ariaLabel !== undefined && ariaLabel !== null) {
      this.$.overlay.setAttribute('aria-label', ariaLabel);
    } else {
      this.$.overlay.removeAttribute('aria-label');
    }
  }

  /** @private */
  _onOverlayOpened(e) {
    if (e.detail.value === false) {
      this.opened = false;
    }
  }

  /**
   * Close the dialog if `noCloseOnOutsideClick` isn't set to true
   * @private
   */
  _handleOutsideClick(e) {
    if (this.noCloseOnOutsideClick) {
      e.preventDefault();
    }
  }

  /**
   * Close the dialog if `noCloseOnEsc` isn't set to true
   * @private
   */
  _handleEscPress(e) {
    if (this.noCloseOnEsc) {
      e.preventDefault();
    }
  }

  /** @private */
  _bringOverlayToFront() {
    if (this.modeless) {
      this.$.overlay.bringToFront();
    }
  }
}

customElements.define(DialogElement.is, DialogElement);

export { DialogElement };
