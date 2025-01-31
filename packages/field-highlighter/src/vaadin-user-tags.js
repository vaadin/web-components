/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-user-tag.js';
import './vaadin-user-tags-overlay.js';
import { css, html, LitElement } from 'lit';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';

const listenOnce = (elem, type) => {
  return new Promise((resolve) => {
    const listener = () => {
      elem.removeEventListener(type, listener);
      resolve();
    };
    elem.addEventListener(type, listener);
  });
};

/**
 * An element used internally by `<vaadin-field-highlighter>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @private
 */
export class UserTags extends PolylitMixin(LitElement) {
  static get is() {
    return 'vaadin-user-tags';
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <vaadin-user-tags-overlay
        id="overlay"
        modeless
        .opened="${this.opened}"
        no-vertical-overlap
        @vaadin-overlay-open="${this._onOverlayOpen}"
      ></vaadin-user-tags-overlay>
    `;
  }

  static get properties() {
    return {
      /**
       * True when the field has focus. In this case, the overlay
       * with a list of the user tags needs to be always visible.
       */
      hasFocus: {
        type: Boolean,
        value: false,
        observer: '_hasFocusChanged',
      },

      /**
       * True when the overlay is opened.
       */
      opened: {
        type: Boolean,
        value: false,
        sync: true,
      },

      /**
       * True when the overlay is flashing: quickly shown and then hidden
       * once a different user starts to interact with the field.
       */
      flashing: {
        type: Boolean,
        value: false,
      },

      /**
       * A target element that the overlay is positioned to.
       */
      target: {
        type: Object,
        observer: '__targetChanged',
      },

      /**
       * A list of users who focused the field.
       */
      users: {
        type: Array,
        value: () => [],
      },

      duration: {
        type: Number,
        value: 200,
      },

      delay: {
        type: Number,
        value: 2000,
      },

      /** @private */
      __flashQueue: {
        type: Array,
        value: () => [],
      },

      /** @private */
      __isTargetVisible: {
        type: Boolean,
        value: false,
      },
    };
  }

  constructor() {
    super();

    this.__targetVisibilityObserver = new IntersectionObserver(
      ([entry]) => {
        this.__onTargetVisibilityChange(entry.isIntersecting);
      },
      { threshold: 1 },
    );
  }

  /** @protected */
  get wrapper() {
    return this.$.overlay.querySelector('[part="tags"]');
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    if (this.target) {
      this.__targetVisibilityObserver.observe(this.target);
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.opened = false;
    if (this.target) {
      this.__targetVisibilityObserver.unobserve(this.target);
    }
  }

  /** @protected */
  ready() {
    super.ready();

    this.$.overlay.renderer = (root) => {
      if (!root.firstChild) {
        const tags = document.createElement('div');
        tags.setAttribute('part', 'tags');
        root.appendChild(tags);
      }
    };

    this.$.overlay.requestContentUpdate();
  }

  /** @private */
  __onTargetVisibilityChange(isVisible) {
    this.__isTargetVisible = isVisible;

    // Open the overlay and run the flashing animation for the user tags
    // that have been enqueued (if any) during a `.setUsers()` call
    // because the field was not visible at that point.
    if (isVisible && this.__flashQueue.length > 0 && !this.flashing) {
      this.flashTags(this.__flashQueue.shift());
      return;
    }

    // Open the overlay when the field is visible and focused.
    // - opens the overlay in the case it was not opened during a `.show()` call because the field was not visible at that point.
    // - re-opens the overlay in the case it was closed because the focused field became not visible for a while (see the below check).
    if (isVisible && this.hasFocus) {
      this.opened = true;
      return;
    }

    // Close the overlay when the field is not visible.
    // The focused field will be re-opened once it becomes visible again (see the above check).
    if (!isVisible && this.opened) {
      this.opened = false;
    }
  }

  /** @private */
  __targetChanged(newTarget, oldTarget) {
    this.$.overlay.positionTarget = newTarget;

    if (oldTarget) {
      this.__targetVisibilityObserver.unobserve(oldTarget);
    }

    if (newTarget) {
      this.__targetVisibilityObserver.observe(newTarget);
    }
  }

  /** @private */
  _hasFocusChanged(hasFocus) {
    if (hasFocus && this.flashing) {
      this.stopFlash();
    }
  }

  createUserTag(user) {
    const tag = document.createElement('vaadin-user-tag');
    tag.name = user.name;
    tag.uid = user.id;
    tag.colorIndex = user.colorIndex;
    return tag;
  }

  getTagForUser(user) {
    return Array.from(this.wrapper.children).find((tag) => tag.uid === user.id);
  }

  getChangedTags(addedUsers, removedUsers) {
    const removed = removedUsers.map((user) => this.getTagForUser(user));
    const added = addedUsers.map((user) => this.getTagForUser(user) || this.createUserTag(user));
    return { added, removed };
  }

  applyTagsStart({ added, removed }) {
    const wrapper = this.wrapper;
    removed.forEach((tag) => {
      if (tag) {
        tag.classList.add('removing');
        tag.classList.remove('show');
      }
    });
    added.forEach((tag) => wrapper.insertBefore(tag, wrapper.firstChild));
  }

  applyTagsEnd({ added, removed }) {
    const wrapper = this.wrapper;
    removed.forEach((tag) => {
      if (tag && tag.parentNode === wrapper) {
        wrapper.removeChild(tag);
      }
    });
    added.forEach((tag) => tag && tag.classList.add('show'));
  }

  setUsers(users) {
    // Apply pending change if needed
    this.requestContentUpdate();

    let addedUsers = [];
    let removedUsers = [];

    const hasNewUsers = Array.isArray(users);
    const hasOldUsers = Array.isArray(this.users);

    if (hasOldUsers) {
      const newUserIds = (users || []).map((user) => user.id);
      removedUsers = this.users.filter((item) => !newUserIds.includes(item.id));
    }

    if (hasNewUsers) {
      const oldUserIds = (this.users || []).map((user) => user.id);
      addedUsers = users.filter((item) => !oldUserIds.includes(item.id)).reverse();
    }

    if (addedUsers.length === 0 && removedUsers.length === 0) {
      return;
    }

    const changedTags = this.getChangedTags(addedUsers, removedUsers);

    // Check if flash queue contains pending tags for removed users
    if (this.__flashQueue.length > 0) {
      removedUsers.forEach((user, i) => {
        if (changedTags.removed[i] === null) {
          return;
        }

        this.__flashQueue.forEach((tags) => {
          if (tags.some((tag) => tag.uid === user.id)) {
            this.__flashQueue = this.__flashQueue.filter((_, index) => index !== i);
          }
        });
      });
    }

    if (this.opened && this.hasFocus) {
      this.updateTags(users, changedTags);
    } else if (addedUsers.length > 0 && document.visibilityState !== 'hidden') {
      // Avoid adding to queue if window is not visible.

      const addedTags = changedTags.added;
      const removedTags = changedTags.removed;

      // Only sync the removed user tags.
      // The added tags are handled by the `flashTags` method.
      this.updateTagsSync(users, {
        added: [],
        removed: removedTags,
      });

      if (this.flashing || !this.__isTargetVisible) {
        // Schedule next flash later
        this.__flashQueue = [...this.__flashQueue, addedTags];
      } else {
        this.flashTags(addedTags);
      }
    } else {
      this.updateTagsSync(users, changedTags);
    }
  }

  /** @private */
  _onOverlayOpen() {
    // Animate all tags except removing ones
    Array.from(this.wrapper.children).forEach((tag) => {
      if (!tag.classList.contains('removing')) {
        tag.classList.add('show');
      }
    });
  }

  flashTags(added) {
    this.flashing = true;
    const wrapper = this.wrapper;

    // Hide existing tags
    const hidden = Array.from(wrapper.children);
    hidden.forEach((tag) => {
      tag.style.display = 'none';
    });

    // Render new tags
    added.forEach((tag) => {
      wrapper.insertBefore(tag, wrapper.firstChild);
    });

    this.flashPromise = new Promise((resolve) => {
      listenOnce(this.$.overlay, 'vaadin-overlay-open').then(() => {
        this._debounceFlashStart = Debouncer.debounce(
          this._debounceFlashStart,
          timeOut.after(this.duration + this.delay),
          () => {
            // Animate disappearing
            if (!this.hasFocus) {
              added.forEach((tag) => tag.classList.remove('show'));
            }
            this._debounceFlashEnd = Debouncer.debounce(this._debounceFlashEnd, timeOut.after(this.duration), () => {
              // Show all tags
              const finishFlash = () => {
                hidden.forEach((tag) => {
                  tag.style.display = 'block';
                });
                this.flashing = false;
                resolve();
              };

              if (this.hasFocus) {
                finishFlash();
              } else {
                // Wait for overlay closing animation to complete
                listenOnce(this.$.overlay, 'animationend').then(() => {
                  finishFlash();
                });

                this.opened = false;
              }
            });
          },
        );
      });
    }).then(() => {
      if (this.__flashQueue.length > 0) {
        const tags = this.__flashQueue[0];
        this.__flashQueue = [...this.__flashQueue].slice(1);
        this.flashTags(tags);
      }
    });

    this.opened = true;
  }

  stopFlash() {
    if (this._debounceFlashStart) {
      this._debounceFlashStart.flush();
    }
    if (this._debounceFlashEnd) {
      this._debounceFlashEnd.flush();
    }
    this.$.overlay._flushAnimation('closing');
  }

  updateTags(users, changed) {
    this.applyTagsStart(changed);

    this._debounceRender = Debouncer.debounce(this._debounceRender, timeOut.after(this.duration), () => {
      this.users = users;

      this.applyTagsEnd(changed);

      if (users.length === 0 && this.opened) {
        this.opened = false;
      }
    });
  }

  updateTagsSync(users, changed) {
    this.applyTagsStart(changed);
    this.users = users;
    this.applyTagsEnd(changed);
  }

  show() {
    this.hasFocus = true;
    if (this.__isTargetVisible) {
      this.opened = true;
    }
  }

  hide() {
    this.hasFocus = false;
    this.opened = false;
  }

  requestContentUpdate() {
    /* c8 ignore next */
    if (this._debounceRender && this._debounceRender.isActive()) {
      this._debounceRender.flush();
    }
  }
}

defineCustomElement(UserTags);
