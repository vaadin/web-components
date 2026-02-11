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
 * `disabled`         | Set when the drop zone is effectively disabled
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
       * Returns true if either explicitly disabled, manager is disabled, or no manager is set.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
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

  /**
   * Whether the drop zone is disabled.
   * Returns true if either explicitly disabled, manager is disabled, or no manager is set.
   * @type {boolean}
   * @override
   */
  get disabled() {
    return this.__effectiveDisabled;
  }

  set disabled(value) {
    if (this.__syncingDisabled) return;
    this.__explicitDisabled = Boolean(value);
    this.__syncDisabledState();
  }

  /**
   * Override to intercept external disabled attribute changes.
   * `toggleAttribute('disabled', true)` is a no-op per DOM spec when the
   * attribute already exists, so `attributeChangedCallback` won't fire.
   * This override ensures `__explicitDisabled` is updated in that case.
   * @override
   */
  toggleAttribute(name, force) {
    if (name === 'disabled' && !this.__syncingDisabled) {
      this.__explicitDisabled = force === undefined ? !this.hasAttribute('disabled') : Boolean(force);
      this.__syncDisabledState();
      return this.hasAttribute('disabled');
    }
    return super.toggleAttribute(name, force);
  }

  constructor() {
    super();
    this.__explicitDisabled = false;
    this.__onMaxFilesReachedChanged = this.__onMaxFilesReachedChanged.bind(this);
    this.__syncDisabledState = this.__syncDisabledState.bind(this);
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

    // Clean up manager listeners to prevent memory leaks
    if (this.manager instanceof UploadManager) {
      this.manager.removeEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);
      this.manager.removeEventListener('disabled-changed', this.__syncDisabledState);
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    // Re-attach manager listeners when reconnected to DOM
    if (this.manager instanceof UploadManager) {
      this.manager.addEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);
      this.manager.addEventListener('disabled-changed', this.__syncDisabledState);

      // Sync state with current manager state
      this.maxFilesReached = !!this.manager.maxFilesReached;
    }
    this.__syncDisabledState();
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @private */
  get __effectiveDisabled() {
    const noManager = !(this.manager instanceof UploadManager);
    return this.__explicitDisabled || noManager || this.manager.disabled || this.maxFilesReached;
  }

  /** @private */
  __onDragover(event) {
    event.preventDefault();
    if (!this.__effectiveDisabled) {
      this.__dragover = true;
    }
    event.dataTransfer.dropEffect = this.__effectiveDisabled ? 'none' : 'copy';
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

    if (!this.__effectiveDisabled) {
      const files = await getFilesFromDropEvent(event);
      this.manager.addFiles(files);
    }
  }

  /** @private */
  __managerChanged(manager, oldManager) {
    // Remove listeners from old manager
    if (oldManager instanceof UploadManager) {
      oldManager.removeEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);
      oldManager.removeEventListener('disabled-changed', this.__syncDisabledState);
    }

    // Add listeners to new manager
    if (this.isConnected && manager instanceof UploadManager) {
      manager.addEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);
      manager.addEventListener('disabled-changed', this.__syncDisabledState);

      // Sync initial state
      this.maxFilesReached = !!manager.maxFilesReached;
    } else {
      this.maxFilesReached = false;
    }

    if (this.isConnected) {
      this.__syncDisabledState();
    }
  }

  /** @private */
  __onMaxFilesReachedChanged(event) {
    this.maxFilesReached = event.detail.value;
    this.__syncDisabledState();
  }

  /** @private */
  __syncDisabledState() {
    this.__syncingDisabled = true;
    this.toggleAttribute('disabled', this.__effectiveDisabled);
    this.__syncingDisabled = false;
  }
}

defineCustomElement(UploadDropZone);

export { UploadDropZone };
