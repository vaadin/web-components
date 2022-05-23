/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-user-tag.js';
import './vaadin-user-tags-overlay.js';
import { calculateSplices } from '@polymer/polymer/lib/utils/array-splice.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

const DURATION = 200;
const DELAY = 2000;

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
 * @extends HTMLElement
 * @private
 */
export class UserTags extends PolymerElement {
  static get is() {
    return 'vaadin-user-tags';
  }

  static get template() {
    return html`
      <style>
        :host {
          position: absolute;
        }
      </style>
      <vaadin-user-tags-overlay
        id="overlay"
        modeless
        opened="[[opened]]"
        no-vertical-overlap
        on-vaadin-overlay-open="_onOverlayOpen"
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

      /** @private */
      _flashQueue: {
        type: Array,
        value: () => [],
      },
    };
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.opened = false;
  }

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
  __targetChanged(target) {
    this.$.overlay.positionTarget = target;
  }

  /** @private */
  _hasFocusChanged(hasFocus) {
    if (hasFocus && this.flashing) {
      this.stopFlash();
    }
  }

  get wrapper() {
    return this.$.overlay.content.querySelector('[part="tags"]');
  }

  createUserTag(user) {
    const tag = document.createElement('vaadin-user-tag');
    tag.name = user.name;
    tag.uid = user.id;
    tag.colorIndex = user.colorIndex;
    return tag;
  }

  getTagForUser(user) {
    return Array.from(this.wrapper.children).filter((tag) => tag.uid === user.id)[0];
  }

  getChangedTags(addedUsers, removedUsers) {
    const removed = removedUsers.map((user) => this.getTagForUser(user));
    const added = addedUsers.map((user) => this.getTagForUser(user) || this.createUserTag(user));
    return { added, removed };
  }

  getChangedUsers(users, splices) {
    const usersToAdd = [];
    const usersToRemove = [];

    splices.forEach((splice) => {
      for (let i = 0; i < splice.removed.length; i++) {
        usersToRemove.push(splice.removed[i]);
      }

      for (let i = splice.addedCount - 1; i >= 0; i--) {
        usersToAdd.push(users[splice.index + i]);
      }
    });

    // filter out users that are only moved
    const addedUsers = usersToAdd.filter((u) => !usersToRemove.some((u2) => u.id === u2.id));
    const removedUsers = usersToRemove.filter((u) => !usersToAdd.some((u2) => u.id === u2.id));

    return { addedUsers, removedUsers };
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

    const splices = calculateSplices(users, this.users);
    if (splices.length === 0) {
      return;
    }

    const { addedUsers, removedUsers } = this.getChangedUsers(users, splices);
    if (addedUsers.length === 0 && removedUsers.length === 0) {
      return;
    }

    const changedTags = this.getChangedTags(addedUsers, removedUsers);

    // check if flash queue contains pending tags for removed users
    if (this._flashQueue.length > 0) {
      for (let i = 0; i < removedUsers.length; i++) {
        if (changedTags.removed[i] === null) {
          for (let j = 0; j < this._flashQueue.length; j++) {
            if (this._flashQueue[j].some((tag) => tag.uid === removedUsers[i].id)) {
              this.splice('_flashQueue', i, 1);
            }
          }
        }
      }
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

      if (this.flashing) {
        // Schedule next flash later
        this.push('_flashQueue', addedTags);
      } else {
        this.flashTags(addedTags);
      }
    } else {
      this.updateTagsSync(users, changedTags);
    }
  }

  /** @private */
  _onOverlayOpen() {
    // animate all tags except removing ones
    Array.from(this.wrapper.children).forEach((tag) => {
      if (!tag.classList.contains('removing')) {
        tag.classList.add('show');
      }
    });
  }

  flashTags(added) {
    this.flashing = true;
    const wrapper = this.wrapper;

    // hide existing tags
    const hidden = Array.from(wrapper.children);
    hidden.forEach((tag) => (tag.style.display = 'none'));

    // render new tags
    added.forEach((tag) => {
      wrapper.insertBefore(tag, wrapper.firstChild);
    });

    this.flashPromise = new Promise((resolve) => {
      listenOnce(this.$.overlay, 'vaadin-overlay-open').then(() => {
        this._debounceFlashStart = Debouncer.debounce(this._debounceFlashStart, timeOut.after(DURATION + DELAY), () => {
          // animate disappearing
          if (!this.hasFocus) {
            added.forEach((tag) => tag.classList.remove('show'));
          }
          this._debounceFlashEnd = Debouncer.debounce(this._debounceFlashEnd, timeOut.after(DURATION), () => {
            // show all tags
            const finishFlash = () => {
              hidden.forEach((tag) => (tag.style.display = 'block'));
              this.flashing = false;
              resolve();
            };

            if (this.hasFocus) {
              finishFlash();
            } else {
              // wait for overlay closing animation to complete
              listenOnce(this.$.overlay, 'animationend').then(() => {
                finishFlash();
              });

              this.opened = false;
            }
          });
        });
      });
    }).then(() => {
      if (this._flashQueue.length > 0) {
        const tags = this._flashQueue[0];
        this.splice('_flashQueue', 0, 1);
        this.flashTags(tags);
      }
    });

    this.opened = true;
  }

  stopFlash() {
    this._debounceFlashStart && this._debounceFlashStart.flush();
    this._debounceFlashEnd && this._debounceFlashEnd.flush();
    this.$.overlay._flushAnimation('closing');
  }

  updateTags(users, changed) {
    this.applyTagsStart(changed);

    this._debounceRender = Debouncer.debounce(this._debounceRender, timeOut.after(DURATION), () => {
      this.set('users', users);

      this.applyTagsEnd(changed);

      if (users.length === 0 && this.opened) {
        this.opened = false;
      }
    });
  }

  updateTagsSync(users, changed) {
    this.applyTagsStart(changed);
    this.set('users', users);
    this.applyTagsEnd(changed);
  }

  show() {
    this.hasFocus = true;
    this.opened = true;
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

customElements.define(UserTags.is, UserTags);
