/**
 * @license
 * Copyright (c) 2020 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListBox } from '@vaadin/list-box/src/vaadin-list-box.js';

/**
 * An element used internally by `<vaadin-avatar-group>`. Not intended to be used separately.
 *
 * @extends ListBox
 * @private
 */
class AvatarGroupListBox extends ListBox {
  static get is() {
    return 'vaadin-avatar-group-list-box';
  }
}

customElements.define(AvatarGroupListBox.is, AvatarGroupListBox);
