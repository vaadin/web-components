/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { uploadDropZoneStyles } from './styles/vaadin-upload-drop-zone-base-styles.js';
import { getFilesFromDropEvent } from './vaadin-upload-helpers.js';
import { UploadManager } from './vaadin-upload-manager.js';

/**
 * `<vaadin-upload-drop-zone>` is a Web Component that can be used as a drop zone
 * for file uploads. When files are dropped on the drop zone, they are added to
 * a linked UploadManager.
 *
 * ```html
 * <vaadin-upload-drop-zone>
 *   <p>Drop files here</p>
 * </vaadin-upload-drop-zone>
 * ```
 *
 * The drop zone must be linked to an UploadManager by setting the
 * `manager` property:
 *
 * ```javascript
 * const dropZone = document.querySelector('vaadin-upload-drop-zone');
 * dropZone.manager = uploadManager;
 * ```
 *
 * ### Styling
 *
 * The component has no styling by default. When files are dragged over,
 * the `dragover` attribute is set and the component uses a hover effect.
 * To override the hover effect, use `vaadin-upload-drop-zone[dragover]::after`
 * selector to style the pseudo-element covering the drop zone during dragover.
 *
 * Attribute          | Description
 * -------------------|--------------------------------------------
 * `dragover`         | Set when files are being dragged over the element
 * `disabled`         | Set when the drop zone is explicitly disabled
 * `max-files-reached`| Set when the manager has reached maxFiles
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-upload-drop-zone
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class UploadDropZone extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-upload-drop-zone';
  }

  static get experimental() {
    return 'aiComponents';
  }

  static get styles() {
    return uploadDropZoneStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get properties() {
    return {
      /**
       * Reference to an UploadManager.
       * When set, dropped files will be automatically added to the manager.
       * @type {Object | null}
       */
      manager: {
        type: Object,
        value: null,
        observer: '__managerChanged',
      },

      /**
       * Whether the drop zone is disabled.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        reflect: true,
      },

      /**
       * True when max files has been reached on the manager.
       * @type {boolean}
       * @readonly
       */
      maxFilesReached: {
        type: Boolean,
        value: false,
        reflect: true,
        attribute: 'max-files-reached',
      },

      /** @private */
      __dragover: {
        type: Boolean,
        value: false,
        reflect: true,
        attribute: 'dragover',
      },
    };
  }

  constructor() {
    super();
    this.__onMaxFilesReachedChanged = this.__onMaxFilesReachedChanged.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();

    this.addEventListener('dragover', this.__onDragover.bind(this));
    this.addEventListener('dragleave', this.__onDragleave.bind(this));
    this.addEventListener('drop', this.__onDrop.bind(this));
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    // Clean up manager listener to prevent memory leaks
    if (this.manager instanceof UploadManager) {
      this.manager.removeEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    // Re-attach manager listener when reconnected to DOM
    if (this.manager instanceof UploadManager) {
      this.manager.addEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);

      // Sync maxFilesReached state with current manager state
      this.maxFilesReached = !!this.manager.maxFilesReached;
    }
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @private */
  __onDragover(event) {
    event.preventDefault();
    const effectiveDisabled = this.disabled || this.maxFilesReached;
    if (!effectiveDisabled) {
      this.__dragover = true;
    }
    event.dataTransfer.dropEffect = effectiveDisabled ? 'none' : 'copy';
  }

  /** @private */
  __onDragleave(event) {
    event.preventDefault();
    // Only remove dragover if we're actually leaving the drop zone
    // (not just entering a child element)
    if (event.relatedTarget && this.contains(event.relatedTarget)) {
      return;
    }
    this.__dragover = false;
  }

  /** @private */
  async __onDrop(event) {
    event.preventDefault();
    this.__dragover = false;

    // If we have a manager and not disabled, add the files
    const effectiveDisabled = this.disabled || this.maxFilesReached;
    if (!effectiveDisabled && this.manager instanceof UploadManager) {
      const files = await getFilesFromDropEvent(event);
      this.manager.addFiles(files);
    }
  }

  /** @private */
  __managerChanged(manager, oldManager) {
    // Remove listener from old manager
    if (oldManager instanceof UploadManager) {
      oldManager.removeEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);
    }

    // Add listener to new manager
    if (this.isConnected && manager instanceof UploadManager) {
      manager.addEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);

      // Sync initial state if manager has maxFilesReached property
      this.maxFilesReached = !!manager.maxFilesReached;
    } else {
      this.maxFilesReached = false;
    }
  }

  /** @private */
  __onMaxFilesReachedChanged(event) {
    this.maxFilesReached = event.detail.value;
  }
}

defineCustomElement(UploadDropZone);

export { UploadDropZone };
