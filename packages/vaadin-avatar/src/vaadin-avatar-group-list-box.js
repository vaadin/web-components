/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListBoxElement } from '@vaadin/vaadin-list-box/src/vaadin-list-box.js';

/**
 * An element used internally by `<vaadin-avatar-group>`. Not intended to be used separately.
 *
 * @extends ListBoxElement
 * @private
 */
class AvatarGroupListBoxElement extends ListBoxElement {
  static get is() {
    return 'vaadin-avatar-group-list-box';
  }
}

customElements.define(AvatarGroupListBoxElement.is, AvatarGroupListBoxElement);
