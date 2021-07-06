/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { templatize } from '@polymer/polymer/lib/utils/templatize.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DirMixin } from '@vaadin/vaadin-element-mixin/vaadin-dir-mixin.js';
import { FocusablesHelper } from './vaadin-focusables-helper.js';

/**
 *
 * `<vaadin-overlay>` is a Web Component for creating overlays. The content of the overlay
 * can be populated in two ways: imperatively by using renderer callback function and
 * declaratively by using Polymer's Templates.
 *
 * ### Rendering
 *
 * By default, the overlay uses the content provided by using the renderer callback function.
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
 * **NOTE:** when the renderer property is defined, the `<template>` content is not used.
 *
 * ### Templating
 *
 * Alternatively, the content can be provided with Polymer Template.
 * Overlay finds the first child template and uses that in case renderer callback function
 * is not provided. You can also set a custom template using the `template` property.
 *
 * After the content from the template is stamped, the `content` property
 * points to the content container.
 *
 * The overlay provides `forwardHostProp` when calling
 * `Polymer.Templatize.templatize` for the template, so that the bindings
 * from the parent scope propagate to the content.  You can also pass
 * custom `instanceProps` object using the `instanceProps` property.
 *
 * ```html
 * <vaadin-overlay>
 *   <template>Overlay content</template>
 * </vaadin-overlay>
 * ```
 *
 * **NOTE:** when using `instanceProps`: because of the Polymer limitation,
 * every template can only be templatized once, so it is important
 * to set `instanceProps` before the `template` is assigned to the overlay.
 *
 * ### Styling
 *
 * To style the overlay content, use styles in the parent scope:
 *
 * - If the overlay is used in a component, then the component styles
 *   apply the overlay content.
 * - If the overlay is used in the global DOM scope, then global styles
 *   apply to the overlay content.
 *
 * See examples for styling the overlay content in the live demos.
 *
 * The following Shadow DOM parts are available for styling the overlay component itself:
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
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DirMixin
 */
class OverlayElement extends ThemableMixin(DirMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          z-index: 200;
          position: fixed;

          /* Despite of what the names say, <vaadin-overlay> is just a container
          for position/sizing/alignment. The actual overlay is the overlay part. */

          /* Default position constraints: the entire viewport. Note: themes can
          override this to introduce gaps between the overlay and the viewport. */
          top: 0;
          right: 0;
          bottom: var(--vaadin-overlay-viewport-bottom);
          left: 0;

          /* Use flexbox alignment for the overlay part. */
          display: flex;
          flex-direction: column; /* makes dropdowns sizing easier */
          /* Align to center by default. */
          align-items: center;
          justify-content: center;

          /* Allow centering when max-width/max-height applies. */
          margin: auto;

          /* The host is not clickable, only the overlay part is. */
          pointer-events: none;

          /* Remove tap highlight on touch devices. */
          -webkit-tap-highlight-color: transparent;

          /* CSS API for host */
          --vaadin-overlay-viewport-bottom: 0;
        }

        :host([hidden]),
        :host(:not([opened]):not([closing])) {
          display: none !important;
        }

        [part='overlay'] {
          -webkit-overflow-scrolling: touch;
          overflow: auto;
          pointer-events: auto;

          /* Prevent overflowing the host in MSIE 11 */
          max-width: 100%;
          box-sizing: border-box;

          -webkit-tap-highlight-color: initial; /* reenable tap highlight inside */
        }

        [part='backdrop'] {
          z-index: -1;
          content: '';
          background: rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          pointer-events: auto;
        }
      </style>

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

  static get properties() {
    return {
      /**
       * When true, the overlay is visible and attached to body.
       */
      opened: {
        type: Boolean,
        notify: true,
        observer: '_openedChanged',
        reflectToAttribute: true
      },

      /**
       * Owner element passed with renderer function
       * @type {HTMLElement}
       */
      owner: Element,

      /**
       * Custom function for rendering the content of the overlay.
       * Receives three arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `owner` The host element of the renderer function.
       * - `model` The object with the properties related with rendering.
       * @type {OverlayRenderer | null | undefined}
       */
      renderer: Function,

      /**
       * The template of the overlay content.
       * @type {HTMLTemplateElement | null | undefined}
       */
      template: {
        type: Object,
        notify: true
      },

      /**
       * Optional argument for `Polymer.Templatize.templatize`.
       */
      instanceProps: {
        type: Object
      },

      /**
       * References the content container after the template is stamped.
       * @type {!HTMLElement | undefined}
       */
      content: {
        type: Object,
        notify: true
      },

      /**
       * When true the overlay has backdrop on top of content when opened.
       * @type {boolean}
       */
      withBackdrop: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Object with properties that is passed to `renderer` function
       */
      model: Object,

      /**
       * When true the overlay won't disable the main content, showing
       * it doesn’t change the functionality of the user interface.
       * @type {boolean}
       */
      modeless: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_modelessChanged'
      },

      /**
       * When set to true, the overlay is hidden. This also closes the overlay
       * immediately in case there is a closing animation in progress.
       * @type {boolean}
       */
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_hiddenChanged'
      },

      /**
       * When true move focus to the first focusable element in the overlay,
       * or to the overlay if there are no focusable elements.
       * @type {boolean}
       */
      focusTrap: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to enable restoring of focus when overlay is closed.
       * @type {boolean}
       */
      restoreFocusOnClose: {
        type: Boolean,
        value: false
      },

      /** @private */
      _mouseDownInside: {
        type: Boolean
      },

      /** @private */
      _mouseUpInside: {
        type: Boolean
      },

      /** @private */
      _instance: {
        type: Object
      },

      /** @private */
      _originalContentPart: Object,

      /** @private */
      _contentNodes: Array,

      /** @private */
      _oldOwner: Element,

      /** @private */
      _oldModel: Object,

      /** @private */
      _oldTemplate: Object,

      /** @private */
      _oldInstanceProps: Object,

      /** @private */
      _oldRenderer: Object,

      /** @private */
      _oldOpened: Boolean
    };
  }

  static get observers() {
    return ['_templateOrRendererChanged(template, renderer, owner, model, instanceProps, opened)'];
  }

  constructor() {
    super();
    this._boundMouseDownListener = this._mouseDownListener.bind(this);
    this._boundMouseUpListener = this._mouseUpListener.bind(this);
    this._boundOutsideClickListener = this._outsideClickListener.bind(this);
    this._boundKeydownListener = this._keydownListener.bind(this);

    this._observer = new FlattenedNodesObserver(this, (info) => {
      this._setTemplateFromNodes(info.addedNodes);
    });

    // Listener for preventing closing of the paper-dialog and all components extending `iron-overlay-behavior`.
    this._boundIronOverlayCanceledListener = this._ironOverlayCanceled.bind(this);

    /* c8 ignore next 3 */
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      this._boundIosResizeListener = () => this._detectIosNavbar();
    }
  }

  /** @protected */
  ready() {
    super.ready();

    this._observer.flush();

    // Need to add dummy click listeners to this and the backdrop or else
    // the document click event listener (_outsideClickListener) may never
    // get invoked on iOS Safari (reproducible in <vaadin-dialog>
    // and <vaadin-context-menu>).
    this.addEventListener('click', () => {});
    this.$.backdrop.addEventListener('click', () => {});
  }

  /** @private */
  _detectIosNavbar() {
    /* c8 ignore next 15 */
    if (!this.opened) {
      return;
    }

    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;

    const landscape = innerWidth > innerHeight;

    const clientHeight = document.documentElement.clientHeight;

    if (landscape && clientHeight > innerHeight) {
      this.style.setProperty('--vaadin-overlay-viewport-bottom', clientHeight - innerHeight + 'px');
    } else {
      this.style.setProperty('--vaadin-overlay-viewport-bottom', '0');
    }
  }

  /**
   * @param {!Array<!Element>} nodes
   * @protected
   */
  _setTemplateFromNodes(nodes) {
    this.template = nodes.filter((node) => node.localName && node.localName === 'template')[0] || this.template;
  }

  /**
   * @param {Event=} sourceEvent
   * @event vaadin-overlay-close
   * fired before the `vaadin-overlay` will be closed. If canceled the closing of the overlay is canceled as well.
   */
  close(sourceEvent) {
    var evt = new CustomEvent('vaadin-overlay-close', {
      bubbles: true,
      cancelable: true,
      detail: { sourceEvent: sourceEvent }
    });
    this.dispatchEvent(evt);
    if (!evt.defaultPrevented) {
      this.opened = false;
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    /* c8 ignore next 3 */
    if (this._boundIosResizeListener) {
      this._detectIosNavbar();
      window.addEventListener('resize', this._boundIosResizeListener);
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    /* c8 ignore next 3 */
    if (this._boundIosResizeListener) {
      window.removeEventListener('resize', this._boundIosResizeListener);
    }
  }

  /**
   * Requests an update for the content of the overlay.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (this.renderer) {
      this.renderer.call(this.owner, this.content, this.owner, this.model);
    }
  }

  /**
   * Manually invoke existing renderer.
   *
   * @deprecated Since Vaadin 21, `render()` is deprecated. Please use `requestContentUpdate()` instead.
   */
  render() {
    console.warn('WARNING: Since Vaadin 21, render() is deprecated. Please use requestContentUpdate() instead.');

    this.requestContentUpdate();
  }

  /** @private */
  _ironOverlayCanceled(event) {
    event.preventDefault();
  }

  /** @private */
  _mouseDownListener(event) {
    this._mouseDownInside = event.composedPath().indexOf(this.$.overlay) >= 0;
  }

  /** @private */
  _mouseUpListener(event) {
    this._mouseUpInside = event.composedPath().indexOf(this.$.overlay) >= 0;
  }

  /**
   * We need to listen on 'click' / 'tap' event and capture it and close the overlay before
   * propagating the event to the listener in the button. Otherwise, if the clicked button would call
   * open(), this would happen: https://www.youtube.com/watch?v=Z86V_ICUCD4
   *
   * @event vaadin-overlay-outside-click
   * fired before the `vaadin-overlay` will be closed on outside click. If canceled the closing of the overlay is canceled as well.
   *
   * @private
   */
  _outsideClickListener(event) {
    if (event.composedPath().indexOf(this.$.overlay) !== -1 || this._mouseDownInside || this._mouseUpInside) {
      this._mouseDownInside = false;
      this._mouseUpInside = false;
      return;
    }
    if (!this._last) {
      return;
    }

    const evt = new CustomEvent('vaadin-overlay-outside-click', {
      bubbles: true,
      cancelable: true,
      detail: { sourceEvent: event }
    });
    this.dispatchEvent(evt);

    if (this.opened && !evt.defaultPrevented) {
      this.close(event);
    }
  }

  /**
   * @event vaadin-overlay-escape-press
   * fired before the `vaadin-overlay` will be closed on ESC button press. If canceled the closing of the overlay is canceled as well.
   *
   * @private
   */
  _keydownListener(event) {
    if (!this._last) {
      return;
    }

    // TAB
    if (event.key === 'Tab' && this.focusTrap && !event.defaultPrevented) {
      // if only tab key is pressed, cycle forward, else cycle backwards.
      this._cycleTab(event.shiftKey ? -1 : 1);

      event.preventDefault();

      // ESC
    } else if (event.key === 'Escape' || event.key === 'Esc') {
      const evt = new CustomEvent('vaadin-overlay-escape-press', {
        bubbles: true,
        cancelable: true,
        detail: { sourceEvent: event }
      });
      this.dispatchEvent(evt);

      if (this.opened && !evt.defaultPrevented) {
        this.close(event);
      }
    }
  }

  /** @protected */
  _ensureTemplatized() {
    this._setTemplateFromNodes(Array.from(this.children));
  }

  /**
   * @event vaadin-overlay-open
   * fired after the `vaadin-overlay` is opened.
   *
   * @private
   */
  _openedChanged(opened, wasOpened) {
    if (!this._instance) {
      this._ensureTemplatized();
    }

    if (opened) {
      // Store focused node.
      this.__restoreFocusNode = this._getActiveElement();
      this._animatedOpening();

      afterNextRender(this, () => {
        if (this.focusTrap && !this.contains(document.activeElement)) {
          this._cycleTab(0, 0);
        }

        const evt = new CustomEvent('vaadin-overlay-open', { bubbles: true });
        this.dispatchEvent(evt);
      });

      if (!this.modeless) {
        this._addGlobalListeners();
      }
    } else if (wasOpened) {
      this._animatedClosing();

      if (!this.modeless) {
        this._removeGlobalListeners();
      }
    }
  }

  /** @private */
  _hiddenChanged(hidden) {
    if (hidden && this.hasAttribute('closing')) {
      this._flushAnimation('closing');
    }
  }

  /**
   * @return {boolean}
   * @protected
   */
  _shouldAnimate() {
    const name = getComputedStyle(this).getPropertyValue('animation-name');
    const hidden = getComputedStyle(this).getPropertyValue('display') === 'none';
    return !hidden && name && name != 'none';
  }

  /**
   * @param {string} type
   * @param {Function} callback
   * @protected
   */
  _enqueueAnimation(type, callback) {
    const handler = `__${type}Handler`;
    const listener = (event) => {
      if (event && event.target !== this) {
        return;
      }
      callback();
      this.removeEventListener('animationend', listener);
      delete this[handler];
    };
    this[handler] = listener;
    this.addEventListener('animationend', listener);
  }

  /**
   * @param {string} type
   * @protected
   */
  _flushAnimation(type) {
    const handler = `__${type}Handler`;
    if (typeof this[handler] === 'function') {
      this[handler]();
    }
  }

  /** @protected */
  _animatedOpening() {
    if (this.parentNode === document.body && this.hasAttribute('closing')) {
      this._flushAnimation('closing');
    }
    this._attachOverlay();
    if (!this.modeless) {
      this._enterModalState();
    }
    this.setAttribute('opening', '');

    const finishOpening = () => {
      document.addEventListener('iron-overlay-canceled', this._boundIronOverlayCanceledListener);

      this.removeAttribute('opening');
    };

    if (this._shouldAnimate()) {
      this._enqueueAnimation('opening', finishOpening);
    } else {
      finishOpening();
    }
  }

  /** @protected */
  _attachOverlay() {
    this._placeholder = document.createComment('vaadin-overlay-placeholder');
    this.parentNode.insertBefore(this._placeholder, this);
    document.body.appendChild(this);
    this.bringToFront();
  }

  /** @protected */
  _animatedClosing() {
    if (this.hasAttribute('opening')) {
      this._flushAnimation('opening');
    }
    if (this._placeholder) {
      this._exitModalState();

      if (this.restoreFocusOnClose && this.__restoreFocusNode) {
        // If the activeElement is `<body>` or inside the overlay,
        // we are allowed to restore the focus. In all the other
        // cases focus might have been moved elsewhere by another
        // component or by the user interaction (e.g. click on a
        // button outside the overlay).
        const activeElement = this._getActiveElement();

        if (activeElement === document.body || this._deepContains(activeElement)) {
          this.__restoreFocusNode.focus();
        }
        this.__restoreFocusNode = null;
      }

      this.setAttribute('closing', '');

      const finishClosing = () => {
        document.removeEventListener('iron-overlay-canceled', this._boundIronOverlayCanceledListener);
        this._detachOverlay();
        this.shadowRoot.querySelector('[part="overlay"]').style.removeProperty('pointer-events');
        this.removeAttribute('closing');
      };

      if (this._shouldAnimate()) {
        this._enqueueAnimation('closing', finishClosing);
      } else {
        finishClosing();
      }
    }
  }

  /** @protected */
  _detachOverlay() {
    this._placeholder.parentNode.insertBefore(this, this._placeholder);
    this._placeholder.parentNode.removeChild(this._placeholder);
  }

  /**
   * Returns all attached overlays in visual stacking order.
   * @private
   */
  static get __attachedInstances() {
    return Array.from(document.body.children)
      .filter((el) => el instanceof OverlayElement && !el.hasAttribute('closing'))
      .sort((a, b) => a.__zIndex - b.__zIndex || 0);
  }

  /**
   * returns true if this is the last one in the opened overlays stack
   * @return {boolean}
   * @protected
   */
  get _last() {
    return this === OverlayElement.__attachedInstances.pop();
  }

  /** @private */
  _modelessChanged(modeless) {
    if (!modeless) {
      if (this.opened) {
        this._addGlobalListeners();
        this._enterModalState();
      }
    } else {
      this._removeGlobalListeners();
      this._exitModalState();
    }
  }

  /** @protected */
  _addGlobalListeners() {
    document.addEventListener('mousedown', this._boundMouseDownListener);
    document.addEventListener('mouseup', this._boundMouseUpListener);
    // Firefox leaks click to document on contextmenu even if prevented
    // https://bugzilla.mozilla.org/show_bug.cgi?id=990614
    document.documentElement.addEventListener('click', this._boundOutsideClickListener, true);
    document.addEventListener('keydown', this._boundKeydownListener);
  }

  /** @protected */
  _enterModalState() {
    if (document.body.style.pointerEvents !== 'none') {
      // Set body pointer-events to 'none' to disable mouse interactions with
      // other document nodes.
      this._previousDocumentPointerEvents = document.body.style.pointerEvents;
      document.body.style.pointerEvents = 'none';
    }

    // Disable pointer events in other attached overlays
    OverlayElement.__attachedInstances.forEach((el) => {
      if (el !== this) {
        el.shadowRoot.querySelector('[part="overlay"]').style.pointerEvents = 'none';
      }
    });
  }

  /** @protected */
  _removeGlobalListeners() {
    document.removeEventListener('mousedown', this._boundMouseDownListener);
    document.removeEventListener('mouseup', this._boundMouseUpListener);
    document.documentElement.removeEventListener('click', this._boundOutsideClickListener, true);
    document.removeEventListener('keydown', this._boundKeydownListener);
  }

  /** @protected */
  _exitModalState() {
    if (this._previousDocumentPointerEvents !== undefined) {
      // Restore body pointer-events
      document.body.style.pointerEvents = this._previousDocumentPointerEvents;
      delete this._previousDocumentPointerEvents;
    }

    // Restore pointer events in the previous overlay(s)
    const instances = OverlayElement.__attachedInstances;
    let el;
    // Use instances.pop() to ensure the reverse order
    while ((el = instances.pop())) {
      if (el === this) {
        // Skip the current instance
        continue;
      }
      el.shadowRoot.querySelector('[part="overlay"]').style.removeProperty('pointer-events');
      if (!el.modeless) {
        // Stop after the last modal
        break;
      }
    }
  }

  /** @protected */
  _removeOldContent() {
    if (!this.content || !this._contentNodes) {
      return;
    }

    this._observer.disconnect();

    this._contentNodes.forEach((node) => {
      if (node.parentNode === this.content) {
        this.content.removeChild(node);
      }
    });

    if (this._originalContentPart) {
      // Restore the original <div part="content">
      this.$.content.parentNode.replaceChild(this._originalContentPart, this.$.content);
      this.$.content = this._originalContentPart;
      this._originalContentPart = undefined;
    }

    this._observer.connect();

    this._contentNodes = undefined;
    this.content = undefined;
  }

  /**
   * @param {!HTMLTemplateElement} template
   * @param {object} instanceProps
   * @protected
   */
  _stampOverlayTemplate(template, instanceProps) {
    this._removeOldContent();

    if (!template._Templatizer) {
      template._Templatizer = templatize(template, this, {
        instanceProps: instanceProps,
        forwardHostProp: function (prop, value) {
          if (this._instance) {
            this._instance.forwardHostProp(prop, value);
          }
        }
      });
    }

    this._instance = new template._Templatizer({});
    this._contentNodes = Array.from(this._instance.root.childNodes);

    const templateRoot = template._templateRoot || (template._templateRoot = template.getRootNode());

    if (templateRoot !== document) {
      if (!this.$.content.shadowRoot) {
        this.$.content.attachShadow({ mode: 'open' });
      }

      let scopeCssText = Array.from(templateRoot.querySelectorAll('style')).reduce(
        (result, style) => result + style.textContent,
        ''
      );

      // The overlay root’s :host styles should not apply inside the overlay
      scopeCssText = scopeCssText.replace(/:host/g, ':host-nomatch');

      if (scopeCssText) {
        // Append a style to the content shadowRoot
        const style = document.createElement('style');
        style.textContent = scopeCssText;
        this.$.content.shadowRoot.appendChild(style);
        this._contentNodes.unshift(style);
      }

      this.$.content.shadowRoot.appendChild(this._instance.root);
      this.content = this.$.content.shadowRoot;
    } else {
      this.appendChild(this._instance.root);
      this.content = this;
    }
  }

  /** @private */
  _removeNewRendererOrTemplate(template, oldTemplate, renderer, oldRenderer) {
    if (template !== oldTemplate) {
      this.template = undefined;
    } else if (renderer !== oldRenderer) {
      this.renderer = undefined;
    }
  }

  /** @private */
  _templateOrRendererChanged(template, renderer, owner, model, instanceProps, opened) {
    if (template && renderer) {
      this._removeNewRendererOrTemplate(template, this._oldTemplate, renderer, this._oldRenderer);
      throw new Error('You should only use either a renderer or a template for overlay content');
    }

    const ownerOrModelChanged = this._oldOwner !== owner || this._oldModel !== model;
    this._oldModel = model;
    this._oldOwner = owner;

    const templateOrInstancePropsChanged = this._oldInstanceProps !== instanceProps || this._oldTemplate !== template;
    this._oldInstanceProps = instanceProps;
    this._oldTemplate = template;

    const rendererChanged = this._oldRenderer !== renderer;
    this._oldRenderer = renderer;

    const openedChanged = this._oldOpened !== opened;
    this._oldOpened = opened;

    if (rendererChanged) {
      this.content = this;
      this.content.innerHTML = '';
      // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
      // When clearing the rendered content, this part needs to be manually disposed of.
      // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
      delete this.content._$litPart$;
    }

    if (template && templateOrInstancePropsChanged) {
      this._stampOverlayTemplate(template, instanceProps);
    } else if (renderer && (rendererChanged || openedChanged || ownerOrModelChanged)) {
      if (opened) {
        this.requestContentUpdate();
      }
    }
  }

  /**
   * @param {Element} element
   * @return {boolean}
   * @protected
   */
  _isFocused(element) {
    return element && element.getRootNode().activeElement === element;
  }

  /**
   * @param {Element[]} elements
   * @return {number}
   * @protected
   */
  _focusedIndex(elements) {
    elements = elements || this._getFocusableElements();
    return elements.indexOf(elements.filter(this._isFocused).pop());
  }

  /**
   * @param {number} increment
   * @param {number | undefined} index
   * @protected
   */
  _cycleTab(increment, index) {
    const focusableElements = this._getFocusableElements();

    if (index === undefined) {
      index = this._focusedIndex(focusableElements);
    }

    index += increment;

    // rollover to first item
    if (index >= focusableElements.length) {
      index = 0;
      // go to last item
    } else if (index < 0) {
      index = focusableElements.length - 1;
    }

    focusableElements[index].focus();
  }

  /**
   * @return {!Array<!HTMLElement>}
   * @protected
   */
  _getFocusableElements() {
    // collect all focusable elements
    return FocusablesHelper.getTabbableNodes(this.$.overlay);
  }

  /**
   * @return {!Element}
   * @protected
   */
  _getActiveElement() {
    // document.activeElement can be null
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
    let active = document.activeElement || document.body;
    while (active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active;
  }

  /**
   * @param {!Node} node
   * @return {boolean}
   * @protected
   */
  _deepContains(node) {
    if (this.contains(node)) {
      return true;
    }
    let n = node;
    const doc = node.ownerDocument;
    // walk from node to `this` or `document`
    while (n && n !== doc && n !== this) {
      n = n.parentNode || n.host;
    }
    return n === this;
  }

  /**
   * Brings the overlay as visually the frontmost one
   */
  bringToFront() {
    let zIndex = '';
    const frontmost = OverlayElement.__attachedInstances.filter((o) => o !== this).pop();
    if (frontmost) {
      const frontmostZIndex = frontmost.__zIndex;
      zIndex = frontmostZIndex + 1;
    }
    this.style.zIndex = zIndex;
    this.__zIndex = zIndex || parseFloat(getComputedStyle(this).zIndex);
  }
}

customElements.define(OverlayElement.is, OverlayElement);
export { OverlayElement };
