/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * @polymerMixin
 * @mixes FocusMixin
 */
export const MessageMixin = (superClass) =>
  class MessageMixinClass extends FocusMixin(superClass) {
    static get properties() {
      return {
        /**
         * Time of sending the message. It is rendered as-is to the part='time' slot,
         * so the formatting is up to you.
         */
        time: {
          type: String,
        },

        /**
         * The name of the user posting the message.
         * It will be placed in the name part to indicate who has sent the message.
         * It is also used as a tooltip for the avatar.
         * Example: `message.userName = "Jessica Jacobs";`
         * @attr {string} user-name
         */
        userName: {
          type: String,
        },

        /**
         * The abbreviation of the user.
         * The abbreviation will be passed on to avatar of the message.
         * If the user does not have an avatar picture set with `userImg`, `userAbbr` will be shown in the avatar.
         * Example: `message.userAbbr = "JJ";`
         * @attr {string} user-abbr
         */
        userAbbr: {
          type: String,
        },

        /**
         * An URL for a user image.
         * The image will be used in the avatar component to show who has sent the message.
         * Example: `message.userImg = "/static/img/avatar.jpg";`
         * @attr {string} user-img
         */
        userImg: {
          type: String,
        },

        /**
         * A color index to be used to render the color of the avatar.
         * With no `userColorIndex` set, the basic avatar color will be used.
         * By setting a userColorIndex, the component will check if there exists a CSS variable defining the color, and uses it if there is one.
         * If now CSS variable is found for the color index, the property for the color will not be set.
         *
         * Example:
         * CSS:
         * ```css
         * html {
         *   --vaadin-user-color-1: red;
         * }
         * ```
         *
         * JavaScript:
         * ```js
         * message.userColorIndex = 1;
         * ```
         * @attr {number} user-color-index
         */
        userColorIndex: {
          type: Number,
        },

        /**
         * An array of attachment objects to display with the message.
         * Each attachment object can have the following properties:
         * - `name`: The name of the attachment file
         * - `url`: The URL of the attachment
         * - `type`: The MIME type of the attachment (e.g., 'image/png', 'application/pdf')
         *
         * Image attachments (type starting with "image/") show a thumbnail preview,
         * while other attachments show a document icon with the file name.
         *
         * @type {Array<{name?: string, url?: string, type?: string}>}
         */
        attachments: {
          type: Array,
        },

        /** @private */
        _avatar: {
          type: Object,
        },
      };
    }

    static get observers() {
      return ['__avatarChanged(_avatar, userName, userAbbr, userImg, userColorIndex)'];
    }

    /** @protected */
    ready() {
      super.ready();

      this._avatarController = new SlotController(this, 'avatar', 'vaadin-avatar', {
        initializer: (avatar) => {
          avatar.setAttribute('aria-hidden', 'true');
          this._avatar = avatar;
        },
      });
      this.addController(this._avatarController);
    }

    /** @private */
    __avatarChanged(avatar, userName, userAbbr, userImg, userColorIndex) {
      if (avatar) {
        avatar.setProperties({
          name: userName,
          abbr: userAbbr,
          img: userImg,
          colorIndex: userColorIndex,
        });
      }
    }

    /**
     * Renders attachments for the message.
     * @return {import('lit').TemplateResult | string}
     * @private
     */
    __renderAttachments() {
      const attachments = this.attachments;
      if (!attachments || attachments.length === 0) {
        return '';
      }

      return html`
        <div part="attachments"> ${attachments.map((attachment) => this.__renderAttachment(attachment))} </div>
      `;
    }

    /**
     * Renders a single attachment.
     * @param {Object} attachment - The attachment object with name, url, and type properties
     * @return {import('lit').TemplateResult}
     * @private
     */
    __renderAttachment(attachment) {
      const isImage = attachment.type && attachment.type.startsWith('image/');

      if (isImage) {
        return html`
          <button
            type="button"
            part="attachment attachment-image"
            @click="${() => this.__onAttachmentClick(attachment)}"
          >
            <img part="attachment-preview" src="${ifDefined(attachment.url)}" alt="${attachment.name || ''}" />
          </button>
        `;
      }

      return html`
        <button type="button" part="attachment attachment-file" @click="${() => this.__onAttachmentClick(attachment)}">
          <span part="attachment-icon"></span>
          <span part="attachment-name">${attachment.name}</span>
        </button>
      `;
    }

    /**
     * Dispatches an event when an attachment is clicked.
     * @param {Object} attachment - The attachment that was clicked
     * @private
     */
    __onAttachmentClick(attachment) {
      this.dispatchEvent(
        new CustomEvent('attachment-click', {
          detail: { attachment },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };
