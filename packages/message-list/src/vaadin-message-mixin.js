/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * @polymerMixin
 * @mixes ControllerMixin
 * @mixes FocusMixin
 */
export const MessageMixin = (superClass) =>
  class MessageMixinClass extends FocusMixin(ControllerMixin(superClass)) {
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
          avatar.setAttribute('tabindex', '-1');
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
  };
